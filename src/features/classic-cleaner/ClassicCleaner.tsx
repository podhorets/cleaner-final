import { LinearGradient } from "@tamagui/linear-gradient";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Text, XStack, YStack } from "tamagui";

import { CategoryDropdown } from "@/src/shared/components/CategoryDropdown";
import { PhotoGrid } from "@/src/shared/components/PhotoGrid/PhotoGrid";
import { PhotoGroupGrid } from "@/src/shared/components/PhotoGrid/PhotoGroupGrid";
import { PhotoGridSkeleton } from "@/src/shared/components/PhotoLoading/PhotoGridSkeleton";
import { PhotoGroupGridSkeleton } from "@/src/shared/components/PhotoLoading/PhotoGroupGridSkeleton";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { useCategoryDropdown } from "@/src/shared/hooks/useCategoryDropdown";
import { PhotoCategory } from "@/src/shared/types/categories";
import { useSmartCleanerStore } from "@/src/stores/useSmartCleanerStore";
import { Photo } from "@/src/types/models";

export function ClassicCleaner() {
  // Store state
  const activeCategory = useSmartCleanerStore((state) => state.activeCategory);
  const manualSelections = useSmartCleanerStore(
    (state) => state.manualSelections
  );
  const resources = useSmartCleanerStore((state) => state.resources);
  const isLoading = useSmartCleanerStore((state) => state.isLoading);

  // Store actions
  const setActiveCategory = useSmartCleanerStore(
    (state) => state.setActiveCategory
  );
  const clearActiveCategory = useSmartCleanerStore(
    (state) => state.clearActiveCategory
  );
  const addToSelection = useSmartCleanerStore((state) => state.addToSelection);
  const removeFromSelection = useSmartCleanerStore(
    (state) => state.removeFromSelection
  );
  const clearSelections = useSmartCleanerStore(
    (state) => state.clearSelections
  );
  const fetchAllResources = useSmartCleanerStore(
    (state) => state.fetchAllResources
  );

  // Local UI state
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [similarPhotos, setSimilarPhotos] = useState<Photo[][]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSelectionModeActive, setIsSelectionModeActive] = useState(false);

  const { categories } = useCategoryDropdown();

  // Initialize/Reset on mount
  useEffect(() => {
    // Set default category and clear selections
    clearSelections();
    setActiveCategory(PhotoCategory.SIMILAR_PHOTOS);

    return () => {
      clearActiveCategory();
      clearSelections();
    };
  }, []);

  // Load all resources on mount if not already loaded
  useEffect(() => {
    if (activeCategory && resources[activeCategory] === null && !isLoading) {
      fetchAllResources();
    }
  }, [fetchAllResources, resources, isLoading, activeCategory]);

  // Load photos for current category from store
  useEffect(() => {
    if (!activeCategory) return;

    const resource = resources[activeCategory];
    if (resource === null) {
      // Still loading
      setPhotos([]);
      setSimilarPhotos([]);
      return;
    }

    if (activeCategory === PhotoCategory.SIMILAR_PHOTOS) {
      setSimilarPhotos(resource as Photo[][]);
      setPhotos([]);
    } else {
      setPhotos(resource as Photo[]);
      setSimilarPhotos([]);
    }
  }, [activeCategory, resources]);

  // Get all photos for selection logic
  const allPhotos = useMemo(() => {
    if (activeCategory === PhotoCategory.SIMILAR_PHOTOS) {
      return similarPhotos.flat();
    }
    return photos;
  }, [activeCategory, photos, similarPhotos]);

  // Get current selections for active category
  const currentSelections = useMemo(() => {
    if (!activeCategory) return [];
    return manualSelections[activeCategory] || [];
  }, [activeCategory, manualSelections]);

  // Check if all photos are selected
  const isSelectAll = useMemo(() => {
    return (
      allPhotos.length > 0 && currentSelections.length === allPhotos.length
    );
  }, [allPhotos, currentSelections]);

  // Category selection - RESET ALL STATE
  const handleSelectCategory = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId as PhotoCategory);
      clearSelections(); // Clear selections
      setPhotos([]); // Clear photos
      setSimilarPhotos([]); // Clear grouped photos
      setIsSelectionModeActive(false); // Exit selection mode
    },
    [setActiveCategory, clearSelections]
  );

  // Toggle individual photo selection
  const handleTogglePhoto = useCallback(
    (photoId: string) => {
      if (!activeCategory) return;

      const isSelected = currentSelections.includes(photoId);
      if (isSelected) {
        removeFromSelection(activeCategory, [photoId]);
      } else {
        addToSelection(activeCategory, [photoId]);
      }
    },
    [activeCategory, currentSelections, addToSelection, removeFromSelection]
  );

  // Select all photos
  const handleSelectAll = useCallback(() => {
    if (!activeCategory) return;
    const allPhotoIds = allPhotos.map((p) => p.id);
    addToSelection(activeCategory, allPhotoIds);
  }, [activeCategory, allPhotos, addToSelection]);

  // Cancel - clear all selections and exit selection mode
  const handleCancel = useCallback(() => {
    clearSelections();
    setIsSelectionModeActive(false);
  }, [clearSelections]);

  // Enter selection mode
  const handleEnterSelectionMode = useCallback(() => {
    setIsSelectionModeActive(true);
  }, []);

  // Delete selected photos
  const handleDelete = useCallback(async () => {
    if (currentSelections.length === 0) return;

    setIsDeleting(true);
    try {
      console.log("Deleting photos:", currentSelections);

      // TODO: Call store deletion method when available
      // await deletePhotos(currentSelections);

      // For now, just clear selections
      clearSelections();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [currentSelections, clearSelections]);

  // Determine header button (3 states)
  const getHeaderAction = () => {
    // State 1: Not in selection mode
    if (!isSelectionModeActive) {
      return {
        label: "Select",
        onPress: handleEnterSelectionMode,
        color: "blue" as const,
      };
    }

    // State 2: In selection mode, all selected
    if (isSelectAll) {
      return {
        label: "Cancel",
        onPress: handleCancel,
        color: "red" as const,
      };
    }

    // State 3: In selection mode, not all selected
    return {
      label: "Select All",
      onPress: handleSelectAll,
      color: "blue" as const,
    };
  };

  const hasSelectedPhotos = currentSelections.length > 0;
  const showBottomButton = hasSelectedPhotos;

  if (isLoading || !activeCategory) {
    return (
      <YStack flex={1} bg="$darkBgAlt">
        <ScreenHeader title="Classic Cleaner" rightAction={getHeaderAction()} />
        <XStack px="$4" pb="$2">
          <CategoryDropdown
            categories={categories}
            selectedCategoryId={activeCategory || PhotoCategory.SCREENSHOTS}
            onSelectCategory={handleSelectCategory}
          />
        </XStack>
        {activeCategory === PhotoCategory.SIMILAR_PHOTOS ? (
          <PhotoGroupGridSkeleton />
        ) : (
          <PhotoGridSkeleton />
        )}
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$darkBgAlt">
      <ScreenHeader title="Classic Cleaner" rightAction={getHeaderAction()} />
      <XStack px="$4" pb="$2">
        <CategoryDropdown
          categories={categories}
          selectedCategoryId={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
      </XStack>
      {activeCategory === PhotoCategory.SIMILAR_PHOTOS ? (
        <PhotoGroupGrid
          groups={similarPhotos.map((group: Photo[], index: number) => ({
            id: `group-${index}`,
            photos: group,
          }))}
          isSelectionMode={isSelectionModeActive}
          onTogglePhoto={handleTogglePhoto}
        />
      ) : (
        <PhotoGrid
          photos={photos}
          isSelectionMode={isSelectionModeActive}
          onTogglePhoto={handleTogglePhoto}
        />
      )}
      {showBottomButton && (
        <YStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          pb="$10"
          pt="$6"
          px="$4"
          gap="$3"
        >
          <LinearGradient
            colors={["rgba(28,28,36,0.85)", "rgba(28,28,36,0)"]}
            start={[0, 1]}
            end={[0, 0]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
            }}
          />
          <Button
            bg="#0385ff"
            br="$6"
            h={55}
            onPress={handleDelete}
            w="100%"
            disabled={isDeleting}
          >
            <Text fs={17} fw="$semibold" color="$white">
              {isDeleting
                ? "Deleting..."
                : `Delete ${currentSelections.length} item${
                    currentSelections.length === 1 ? "" : "s"
                  }`}
            </Text>
          </Button>
        </YStack>
      )}
    </YStack>
  );
}
