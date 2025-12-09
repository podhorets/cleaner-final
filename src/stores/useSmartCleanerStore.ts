import * as Contacts from "expo-contacts";
import { create } from "zustand";

import { findDuplicateContacts } from "@/src/services/duplicateContactsService";
import { getScreenshots } from "@/src/services/photo/screenshots";
import { getSelfies } from "@/src/services/photo/selfies";
import { getSimilarPhotos } from "@/src/services/photo/similarPhotos";
import { requestMediaPermissions } from "@/src/services/photo/utils";
import { getLivePhotos, getLongVideos } from "@/src/services/photo/videos";
import { PhotoCategory } from "@/src/shared/types/categories";
import { Photo } from "@/src/types/models";

/**
 * Resources stored in the store
 * Note: Similar photos and duplicate contacts are grouped (arrays of arrays)
 */
interface Resources {
  [PhotoCategory.SCREENSHOTS]: Photo[] | null;
  [PhotoCategory.SELFIES]: Photo[] | null;
  [PhotoCategory.SIMILAR_PHOTOS]: Photo[][] | null; // Groups
  [PhotoCategory.LIVE_PHOTOS]: Photo[] | null;
  [PhotoCategory.LONG_VIDEOS]: Photo[] | null;
  [PhotoCategory.DUPLICATE_CONTACTS]: Contacts.ExistingContact[][] | null; // Groups
}

/**
 * Manual selections stored as arrays of IDs
 */
interface ManualSelections {
  [PhotoCategory.SCREENSHOTS]: string[];
  [PhotoCategory.SELFIES]: string[];
  [PhotoCategory.SIMILAR_PHOTOS]: string[];
  [PhotoCategory.LIVE_PHOTOS]: string[];
  [PhotoCategory.LONG_VIDEOS]: string[];
  [PhotoCategory.DUPLICATE_CONTACTS]: string[];
}

const initialSelections: ManualSelections = {
  [PhotoCategory.SCREENSHOTS]: [],
  [PhotoCategory.SELFIES]: [],
  [PhotoCategory.SIMILAR_PHOTOS]: [],
  [PhotoCategory.LIVE_PHOTOS]: [],
  [PhotoCategory.LONG_VIDEOS]: [],
  [PhotoCategory.DUPLICATE_CONTACTS]: [],
};

interface SmartCleanerState {
  // State
  resources: Resources;
  manualSelections: ManualSelections;
  isLoading: boolean;
  activeCategory: PhotoCategory | null;
  checkedCategories: Set<PhotoCategory>;

  // Resource loading (Requirement 1)
  fetchAllResources: () => Promise<void>;
  refetchCategory: (category: PhotoCategory) => Promise<void>;

  // Manual selection (Requirement 2)
  addToSelection: (category: PhotoCategory, ids: string[]) => void;
  removeFromSelection: (category: PhotoCategory, ids: string[]) => void;
  clearSelections: (category?: PhotoCategory) => void;

  // Smart deletion logic (Requirement 3)
  getIdsToDelete: (category: PhotoCategory) => string[];
  getAllIdsToDelete: () => string[];

  // Active category management
  setActiveCategory: (category: PhotoCategory) => void;
  clearActiveCategory: () => void;
  isPhotoSelected: (photoId: string) => boolean;

  // Category checking (for deletion)
  toggleCategoryChecked: (category: PhotoCategory) => void;
  isCategoryChecked: (category: PhotoCategory) => boolean;
  resetCheckedCategories: () => void;
}

export const useSmartCleanerStore = create<SmartCleanerState>((set, get) => ({
  // Initial state
  resources: {
    [PhotoCategory.SCREENSHOTS]: null,
    [PhotoCategory.SELFIES]: null,
    [PhotoCategory.SIMILAR_PHOTOS]: null,
    [PhotoCategory.LIVE_PHOTOS]: null,
    [PhotoCategory.LONG_VIDEOS]: null,
    [PhotoCategory.DUPLICATE_CONTACTS]: null,
  },
  manualSelections: { ...initialSelections },
  isLoading: false,
  activeCategory: null,
  checkedCategories: new Set([
    PhotoCategory.SIMILAR_PHOTOS,
    PhotoCategory.SCREENSHOTS,
    PhotoCategory.SELFIES,
    PhotoCategory.LONG_VIDEOS,
    PhotoCategory.DUPLICATE_CONTACTS,
  ]),

  // ============================================================================
  // Requirement 1: Resource Loading
  // ============================================================================

  fetchAllResources: async () => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) {
      return;
    }

    set({ isLoading: true });

    // Fetch all resources in parallel
    Promise.all([
      getScreenshots().catch(() => []),
      getSelfies().catch(() => []),
      getSimilarPhotos(5).catch(() => []),
      getLivePhotos().catch(() => []),
      getLongVideos().catch(() => []),
      findDuplicateContacts().catch(() => []),
    ]).then(
      ([
        screenshots,
        selfies,
        similarPhotos,
        livePhotos,
        longVideos,
        duplicateContacts,
      ]) => {
        set({
          resources: {
            [PhotoCategory.SCREENSHOTS]: screenshots,
            [PhotoCategory.SELFIES]: selfies,
            [PhotoCategory.SIMILAR_PHOTOS]: similarPhotos,
            [PhotoCategory.LIVE_PHOTOS]: livePhotos,
            [PhotoCategory.LONG_VIDEOS]: longVideos,
            [PhotoCategory.DUPLICATE_CONTACTS]: duplicateContacts,
          },
          isLoading: false,
        });
      }
    );
  },

  refetchCategory: async (category: PhotoCategory) => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) return;

    let data: any = null;

    switch (category) {
      case PhotoCategory.SCREENSHOTS:
        data = await getScreenshots().catch(() => []);
        break;
      case PhotoCategory.SELFIES:
        data = await getSelfies().catch(() => []);
        break;
      case PhotoCategory.SIMILAR_PHOTOS:
        data = await getSimilarPhotos(5).catch(() => []);
        break;
      case PhotoCategory.LIVE_PHOTOS:
        data = await getLivePhotos().catch(() => []);
        break;
      case PhotoCategory.LONG_VIDEOS:
        data = await getLongVideos().catch(() => []);
        break;
      case PhotoCategory.DUPLICATE_CONTACTS:
        data = await findDuplicateContacts().catch(() => []);
        break;
    }

    set({
      resources: {
        ...get().resources,
        [category]: data,
      },
    });
  },

  // ============================================================================
  // Requirement 2: Manual Selection
  // ============================================================================

  addToSelection: (category, ids) => {
    console.log("addToSelection", category, ids);
    const current = get().manualSelections[category];
    const newIds = [...new Set([...current, ...ids])];
    set({
      manualSelections: {
        ...get().manualSelections,
        [category]: newIds,
      },
    });
  },

  removeFromSelection: (category, ids) => {
    const current = get().manualSelections[category];
    const newIds = current.filter((id) => !ids.includes(id));
    set({
      manualSelections: {
        ...get().manualSelections,
        [category]: newIds,
      },
    });
  },

  clearSelections: (category) => {
    if (category) {
      set({
        manualSelections: {
          ...get().manualSelections,
          [category]: [],
        },
      });
    } else {
      set({
        manualSelections: { ...initialSelections },
      });
    }
  },

  // ============================================================================
  // Requirement 3: Smart Deletion Logic
  // ============================================================================

  getIdsToDelete: (category): string[] => {
    const { manualSelections, resources } = get();

    // If user has manual selections, use those
    if (manualSelections[category].length > 0) {
      return manualSelections[category];
    }

    // Otherwise, return all IDs from resources
    const resource = resources[category];
    if (!resource) return [];

    // Handle grouped resources (similar photos, duplicate contacts)
    if (
      category === PhotoCategory.SIMILAR_PHOTOS ||
      category === PhotoCategory.DUPLICATE_CONTACTS
    ) {
      const groups = resource as Photo[][] | Contacts.ExistingContact[][];
      return groups.flatMap((group) => group.map((item) => item.id));
    }

    // Handle flat arrays
    const items = resource as Photo[];
    return items.map((item) => item.id);
  },

  getAllIdsToDelete: (): string[] => {
    const { checkedCategories } = get();

    // Only include categories that are checked
    const categories: PhotoCategory[] = Array.from(checkedCategories);

    const allIds = categories.flatMap((category) =>
      get().getIdsToDelete(category)
    );

    return allIds;
  },

  // ============================================================================
  // Active Category Management
  // ============================================================================

  setActiveCategory: (category) => {
    set({ activeCategory: category });
  },

  clearActiveCategory: () => {
    set({ activeCategory: null });
  },

  isPhotoSelected: (photoId): boolean => {
    const { activeCategory, manualSelections } = get();
    if (!activeCategory) return false;
    return manualSelections[activeCategory].includes(photoId);
  },

  // ============================================================================
  // Category Checking (for deletion)
  // ============================================================================

  toggleCategoryChecked: (category) => {
    const current = get().checkedCategories;
    const newSet = new Set(current);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    set({ checkedCategories: newSet });
  },

  isCategoryChecked: (category): boolean => {
    return get().checkedCategories.has(category);
  },

  resetCheckedCategories: () => {
    set({
      checkedCategories: new Set([
        PhotoCategory.SIMILAR_PHOTOS,
        PhotoCategory.SCREENSHOTS,
        PhotoCategory.SELFIES,
        PhotoCategory.LONG_VIDEOS,
        PhotoCategory.DUPLICATE_CONTACTS,
      ]),
    });
  },
}));
