import { create } from "zustand";

import { PhotoCategory } from "@/src/shared/types/categories";

type DeletionCategories = {
  [PhotoCategory.SCREENSHOTS]: string[];
  [PhotoCategory.SELFIES]: string[];
  [PhotoCategory.SIMILAR_PHOTOS]: string[];
  [PhotoCategory.LIVE_PHOTOS]: string[];
  [PhotoCategory.LONG_VIDEOS]: string[];
};

interface DeletionState {
  smartCleanerToDelete: DeletionCategories;
  classicCleanerToDelete: DeletionCategories;
  addToSmartCleaner: (category: PhotoCategory, ids: string[]) => void;
  removeFromSmartCleaner: (category: PhotoCategory, ids: string[]) => void;
  addToClassicCleaner: (category: PhotoCategory, ids: string[]) => void;
  removeFromClassicCleaner: (category: PhotoCategory, ids: string[]) => void;
  clearSmartCleaner: (category?: PhotoCategory) => void;
  clearClassicCleaner: (category?: PhotoCategory) => void;
  getSmartCleanerIds: (category: PhotoCategory) => string[];
  getClassicCleanerIds: (category: PhotoCategory) => string[];
}

const initialCategories: DeletionCategories = {
  [PhotoCategory.SCREENSHOTS]: [],
  [PhotoCategory.SELFIES]: [],
  [PhotoCategory.SIMILAR_PHOTOS]: [],
  [PhotoCategory.LIVE_PHOTOS]: [],
  [PhotoCategory.LONG_VIDEOS]: [],
};

export const useDeletionStore = create<DeletionState>((set, get) => ({
  smartCleanerToDelete: { ...initialCategories },
  classicCleanerToDelete: { ...initialCategories },

  addToSmartCleaner: (category, ids) => {
    const current = get().smartCleanerToDelete[category];
    const newIds = [...new Set([...current, ...ids])];
    set({
      smartCleanerToDelete: {
        ...get().smartCleanerToDelete,
        [category]: newIds,
      },
    });
  },

  removeFromSmartCleaner: (category, ids) => {
    const current = get().smartCleanerToDelete[category];
    const newIds = current.filter((id) => !ids.includes(id));
    set({
      smartCleanerToDelete: {
        ...get().smartCleanerToDelete,
        [category]: newIds,
      },
    });
  },

  addToClassicCleaner: (category, ids) => {
    const current = get().classicCleanerToDelete[category];
    const newIds = [...new Set([...current, ...ids])];
    set({
      classicCleanerToDelete: {
        ...get().classicCleanerToDelete,
        [category]: newIds,
      },
    });
  },

  removeFromClassicCleaner: (category, ids) => {
    const current = get().classicCleanerToDelete[category];
    const newIds = current.filter((id) => !ids.includes(id));
    set({
      classicCleanerToDelete: {
        ...get().classicCleanerToDelete,
        [category]: newIds,
      },
    });
  },

  clearSmartCleaner: (category) => {
    if (category) {
      set({
        smartCleanerToDelete: {
          ...get().smartCleanerToDelete,
          [category]: [],
        },
      });
    } else {
      set({
        smartCleanerToDelete: { ...initialCategories },
      });
    }
  },

  clearClassicCleaner: (category) => {
    if (category) {
      set({
        classicCleanerToDelete: {
          ...get().classicCleanerToDelete,
          [category]: [],
        },
      });
    } else {
      set({
        classicCleanerToDelete: { ...initialCategories },
      });
    }
  },

  getSmartCleanerIds: (category) => {
    return get().smartCleanerToDelete[category];
  },

  getClassicCleanerIds: (category) => {
    return get().classicCleanerToDelete[category];
  },
}));

