import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { YStack } from "tamagui";

import { PhotoGrid } from "@/src/shared/components/PhotoGrid/PhotoGrid";
import { PhotoGroupGrid } from "@/src/shared/components/PhotoGrid/PhotoGroupGrid";
import { PhotoGridSkeleton } from "@/src/shared/components/PhotoLoading/PhotoGridSkeleton";
import { PhotoGroupGridSkeleton } from "@/src/shared/components/PhotoLoading/PhotoGroupGridSkeleton";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { PhotoCategory } from "@/src/shared/types/categories";
import { useSmartCleanerStore } from "@/src/stores/useSmartCleanerStore";
import { Photo } from "@/src/types/models";

export function SmartCleanerCategory() {
  // 1. Read category from query params
  const params = useLocalSearchParams<{ category?: string }>();
  const categoryId =
    (params.category as PhotoCategory) || PhotoCategory.SCREENSHOTS;

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [similarPhotos, setSimilarPhotos] = useState<Photo[][]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    addToSelection,
    removeFromSelection,
    clearSelections,
    resources,
    setActiveCategory,
    clearActiveCategory,
  } = useSmartCleanerStore();

  const manualSelectedIds = useSmartCleanerStore(
    (state) => state.manualSelections[categoryId]
  );

  // Get all photos from groups for selection hook (for similar photos)
  const allPhotos = useMemo(() => {
    if (categoryId === PhotoCategory.SIMILAR_PHOTOS) {
      return similarPhotos.flat();
    }
    return photos;
  }, [photos, similarPhotos, categoryId]);

  // Calculate isSelectAll based on store
  const isSelectAll =
    allPhotos.length > 0 && manualSelectedIds.length === allPhotos.length;

  // Set active category on mount, clear on unmount
  useEffect(() => {
    setActiveCategory(categoryId);
    return () => clearActiveCategory();
  }, [categoryId, setActiveCategory, clearActiveCategory]);

  // 2. Load photos from store resources
  useEffect(() => {
    const loadPhotos = () => {
      setIsLoading(true);
      try {
        const resource = resources[categoryId];

        // Wait for resources to be loaded
        if (resource === null) {
          setIsLoading(false);
          return;
        }

        // Handle similar photos (grouped)
        if (categoryId === PhotoCategory.SIMILAR_PHOTOS) {
          setSimilarPhotos(resource as Photo[][]);
          setPhotos([]);
        } else {
          // Handle flat arrays
          setPhotos(resource as Photo[]);
          setSimilarPhotos([]);
        }
      } catch (error) {
        console.error(`Failed to load photos for ${categoryId}:`, error);
        setPhotos([]);
        setSimilarPhotos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, [categoryId, resources]);

  // Handlers for photo selection
  const handleTogglePhoto = useCallback(
    (photoId: string) => {
      const isSelected = manualSelectedIds.includes(photoId);
      if (isSelected) {
        removeFromSelection(categoryId, [photoId]);
      } else {
        addToSelection(categoryId, [photoId]);
      }
    },
    [manualSelectedIds, categoryId, addToSelection, removeFromSelection]
  );

  const handleToggleSelectAll = useCallback(() => {
    if (isSelectAll) {
      clearSelections(categoryId);
    } else {
      const allPhotoIds = allPhotos.map((p) => p.id);
      addToSelection(categoryId, allPhotoIds);
    }
  }, [isSelectAll, clearSelections, categoryId, allPhotos, addToSelection]);

  // Determine header button
  const getHeaderAction = () => {
    if (isSelectAll) {
      return {
        label: "Cancel",
        onPress: () => clearSelections(categoryId),
        color: "red" as const,
      };
    }
    return {
      label: "Select All",
      onPress: handleToggleSelectAll,
      color: "blue" as const,
    };
  };

  // 3. Display photos in a grid
  if (isLoading) {
    return (
      <YStack flex={1} bg="$darkBgAlt">
        <ScreenHeader title="Smart Cleaner" rightAction={getHeaderAction()} />
        {categoryId === PhotoCategory.SIMILAR_PHOTOS ? (
          <PhotoGroupGridSkeleton />
        ) : (
          <PhotoGridSkeleton />
        )}
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$darkBgAlt">
      <ScreenHeader title="Smart Cleaner" rightAction={getHeaderAction()} />
      {categoryId === PhotoCategory.SIMILAR_PHOTOS ? (
        <PhotoGroupGrid
          groups={similarPhotos.map((group: Photo[], index: number) => ({
            id: `group-${index}`,
            photos: group,
          }))}
          isSelectionMode={true}
          onTogglePhoto={handleTogglePhoto}
        />
      ) : (
        <PhotoGrid
          photos={photos}
          isSelectionMode={true}
          onTogglePhoto={handleTogglePhoto}
        />
      )}
    </YStack>
  );
}
