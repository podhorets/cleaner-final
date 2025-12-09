import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { YStack } from "tamagui";

import { PhotoGrid } from "@/src/shared/components/PhotoGrid/PhotoGrid";
import { PhotoGroupGrid } from "@/src/shared/components/PhotoGrid/PhotoGroupGrid";
import { PhotoGridSkeleton } from "@/src/shared/components/PhotoLoading/PhotoGridSkeleton";
import { PhotoGroupGridSkeleton } from "@/src/shared/components/PhotoLoading/PhotoGroupGridSkeleton";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { usePhotoSelection } from "@/src/shared/hooks/usePhotoSelection";
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
  const lastSyncedPhotosRef = useRef<string>("");

  const { addToSelection, removeFromSelection, clearSelections, resources } =
    useSmartCleanerStore();

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

  const {
    selectedIds,
    isSelectAll,
    togglePhoto,
    toggleSelectAll,
    clearSelection,
  } = usePhotoSelection({ photos: allPhotos });

  // 2. Load photos from store resources instead of refetching
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

        // Clear selection when category changes
        clearSelection();
        lastSyncedPhotosRef.current = "";
      } catch (error) {
        console.error(`Failed to load photos for ${categoryId}:`, error);
        setPhotos([]);
        setSimilarPhotos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, [categoryId, clearSelection, resources]);

  // Sync selectedIds with store when photos are loaded
  useEffect(() => {
    if (allPhotos.length === 0 || isLoading) return;

    // Create a signature for this photo set to avoid re-syncing
    const photosSignature = allPhotos
      .map((p) => p.id)
      .sort()
      .join(",");
    if (lastSyncedPhotosRef.current === photosSignature) return;

    if (manualSelectedIds.length === 0) {
      lastSyncedPhotosRef.current = photosSignature;
      return;
    }

    // Check if all photos should be selected
    const allPhotoIds = allPhotos.map((p) => p.id);
    const allIdsManuallySelected =
      manualSelectedIds.length === allPhotoIds.length;

    if (allIdsManuallySelected && !isSelectAll) {
      // Select all at once instead of toggling each photo
      toggleSelectAll();
    } else if (!allIdsManuallySelected) {
      // Only select specific photos from store
      const currentSet = new Set(selectedIds);
      console.log("currentSet selectedIds", selectedIds);
      // Add photos that should be selected
      manualSelectedIds.forEach((id) => {
        if (!currentSet.has(id) && allPhotos.some((p) => p.id === id)) {
          togglePhoto(id);
        }
      });
    }

    lastSyncedPhotosRef.current = photosSignature;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPhotos.length, isLoading, categoryId]);

  // Wrapper for togglePhoto that syncs with store
  const handleTogglePhoto = useCallback(
    (photoId: string) => {
      // Check current state before toggling
      const willBeSelected = !selectedIds.has(photoId);

      // Toggle the photo selection
      togglePhoto(photoId);

      // Update store (always use smartCleanerToDelete)
      if (willBeSelected) {
        addToSelection(categoryId, [photoId]);
      } else {
        removeFromSelection(categoryId, [photoId]);
      }
    },
    [togglePhoto, selectedIds, categoryId, addToSelection, removeFromSelection]
  );

  const handleToggleSelectAll = useCallback(() => {
    toggleSelectAll();
    const allPhotoIds = allPhotos.map((photo) => photo.id);

    if (isSelectAll) {
      removeFromSelection(categoryId, allPhotoIds);
    } else {
      addToSelection(categoryId, allPhotoIds);
    }
  }, [
    toggleSelectAll,
    allPhotos,
    isSelectAll,
    categoryId,
    addToSelection,
    removeFromSelection,
  ]);

  // Determine header button
  const getHeaderAction = () => {
    if (isSelectAll) {
      return {
        label: "Cancel",
        onPress: () => {
          clearSelection();
          clearSelections(categoryId);
        },
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
          selectedIds={selectedIds}
          isSelectionMode={true}
          onTogglePhoto={handleTogglePhoto}
          onPreviewPhoto={undefined}
        />
      ) : (
        <PhotoGrid
          photos={photos}
          selectedIds={selectedIds}
          isSelectionMode={true}
          onTogglePhoto={handleTogglePhoto}
          onPreviewPhoto={undefined}
        />
      )}
    </YStack>
  );
}
