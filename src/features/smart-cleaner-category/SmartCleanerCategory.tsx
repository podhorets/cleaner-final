import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { YStack } from "tamagui";

import { getScreenshots } from "@/src/services/photo/screenshots";
import { getSelfies } from "@/src/services/photo/selfies";
import { getSimilarPhotos } from "@/src/services/photo/similarPhotos";
import { getLivePhotos, getLongVideos } from "@/src/services/photo/videos";
import { PhotoGrid } from "@/src/shared/components/PhotoGrid/PhotoGrid";
import { PhotoGroupGrid } from "@/src/shared/components/PhotoGrid/PhotoGroupGrid";
import { PhotoGridSkeleton } from "@/src/shared/components/PhotoLoading/PhotoGridSkeleton";
import { PhotoGroupGridSkeleton } from "@/src/shared/components/PhotoLoading/PhotoGroupGridSkeleton";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { usePhotoSelection } from "@/src/shared/hooks/usePhotoSelection";
import { PhotoCategory } from "@/src/shared/types/categories";
import { useDeletionStore } from "@/src/stores/useDeletionStore";
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

  const {
    addToSmartCleaner,
    removeFromSmartCleaner,
    clearSmartCleaner,
    getSmartCleanerIds,
  } = useDeletionStore();

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

  // 2. Fetch photos based on category
  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoading(true);
      try {
        let loadedPhotos: Photo[] = [];
        let similarPhotos: Photo[][] = [];

        switch (categoryId) {
          case PhotoCategory.SCREENSHOTS:
            loadedPhotos = await getScreenshots();
            break;
          case PhotoCategory.SELFIES:
            loadedPhotos = await getSelfies();
            break;
          case PhotoCategory.SIMILAR_PHOTOS:
            similarPhotos = await getSimilarPhotos(5);
            break;
          case PhotoCategory.LONG_VIDEOS:
            loadedPhotos = await getLongVideos();
            break;
          case PhotoCategory.LIVE_PHOTOS:
            loadedPhotos = await getLivePhotos();
            break;
          default:
            loadedPhotos = [];
        }

        setPhotos(loadedPhotos);
        setSimilarPhotos(similarPhotos);
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
  }, [categoryId, clearSelection]);

  // Sync selectedIds with store when photos are loaded
  useEffect(() => {
    if (allPhotos.length === 0 || isLoading) return;

    // Create a signature for this photo set to avoid re-syncing
    const photosSignature = allPhotos
      .map((p) => p.id)
      .sort()
      .join(",");
    if (lastSyncedPhotosRef.current === photosSignature) return;

    const storeIds = getSmartCleanerIds(categoryId);

    if (storeIds.length === 0) {
      lastSyncedPhotosRef.current = photosSignature;
      return;
    }

    const currentSet = new Set(selectedIds);

    // Sync: add IDs from store that aren't selected
    storeIds.forEach((id) => {
      if (!currentSet.has(id) && allPhotos.some((p) => p.id === id)) {
        togglePhoto(id);
      }
    });

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
        addToSmartCleaner(categoryId, [photoId]);
      } else {
        removeFromSmartCleaner(categoryId, [photoId]);
      }
    },
    [
      togglePhoto,
      selectedIds,
      categoryId,
      addToSmartCleaner,
      removeFromSmartCleaner,
    ]
  );

  const handleToggleSelectAll = useCallback(() => {
    toggleSelectAll();
    const allPhotoIds = allPhotos.map((photo) => photo.id);

    if (isSelectAll) {
      removeFromSmartCleaner(categoryId, allPhotoIds);
    } else {
      addToSmartCleaner(categoryId, allPhotoIds);
    }
  }, [
    toggleSelectAll,
    allPhotos,
    isSelectAll,
    categoryId,
    addToSmartCleaner,
    removeFromSmartCleaner,
  ]);

  // Determine header button
  const getHeaderAction = () => {
    if (isSelectAll) {
      return {
        label: "Cancel",
        onPress: () => {
          clearSelection();
          clearSmartCleaner(categoryId);
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
