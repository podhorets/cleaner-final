import { LinearGradient } from "@tamagui/linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Text, XStack, YStack } from "tamagui";

import { getScreenshots } from "@/src/services/photo/screenshots";
import { getSelfies } from "@/src/services/photo/selfies";
import { getSimilarPhotos } from "@/src/services/photo/similarPhotos";
import { getLivePhotos, getLongVideos } from "@/src/services/photo/videos";
import { CategoryDropdown } from "@/src/shared/components/CategoryDropdown";
import { PhotoGrid } from "@/src/shared/components/PhotoGrid/PhotoGrid";
import { PhotoGroupGrid } from "@/src/shared/components/PhotoGrid/PhotoGroupGrid";
import { PhotoGridSkeleton } from "@/src/shared/components/PhotoLoading/PhotoGridSkeleton";
import { PhotoGroupGridSkeleton } from "@/src/shared/components/PhotoLoading/PhotoGroupGridSkeleton";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { useCategoryDropdown } from "@/src/shared/hooks/useCategoryDropdown";
import { usePhotoSelection } from "@/src/shared/hooks/usePhotoSelection";
import { PhotoCategory } from "@/src/shared/types/categories";
import { useDeletionStore } from "@/src/stores/useDeletionStore";
import { Photo } from "@/src/types/models";

export function ClassicCleaner() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<PhotoCategory>(
    PhotoCategory.SCREENSHOTS
  );
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [similarPhotos, setSimilarPhotos] = useState<Photo[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastSyncedPhotosRef = useRef<string>("");

  const { categories } = useCategoryDropdown();

  const {
    addToClassicCleaner,
    removeFromClassicCleaner,
    clearClassicCleaner,
    getClassicCleanerIds,
  } = useDeletionStore();

  const {
    selectedIds,
    isSelectAll,
    togglePhoto,
    toggleSelectAll,
    clearSelection,
  } = usePhotoSelection({ photos });

  // Load photos when category changes
  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoading(true);
      try {
        let loadedPhotos: Photo[] = [];
        let similarPhotos: Photo[][] = [];

        switch (selectedCategoryId) {
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
        console.error(
          `Failed to load photos for ${selectedCategoryId}:`,
          error
        );
        setPhotos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, [selectedCategoryId, clearSelection]);

  // Sync selectedIds with store when photos are loaded
  useEffect(() => {
    if (photos.length === 0 || isLoading) return;

    // Create a signature for this photo set to avoid re-syncing
    const photosSignature = photos
      .map((p) => p.id)
      .sort()
      .join(",");
    if (lastSyncedPhotosRef.current === photosSignature) return;

    const storeIds = getClassicCleanerIds(selectedCategoryId);

    if (storeIds.length === 0) {
      lastSyncedPhotosRef.current = photosSignature;
      return;
    }

    const currentSet = new Set(selectedIds);

    // Sync: add IDs from store that aren't selected
    storeIds.forEach((id) => {
      if (!currentSet.has(id) && photos.some((p) => p.id === id)) {
        togglePhoto(id);
      }
    });

    lastSyncedPhotosRef.current = photosSignature;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.length, isLoading, selectedCategoryId]);

  // Wrapper for togglePhoto that syncs with store
  const handleTogglePhoto = useCallback(
    (photoId: string) => {
      // Check current state before toggling
      const willBeSelected = !selectedIds.has(photoId);

      // Toggle the photo selection
      togglePhoto(photoId);

      // Update store
      if (willBeSelected) {
        addToClassicCleaner(selectedCategoryId, [photoId]);
      } else {
        removeFromClassicCleaner(selectedCategoryId, [photoId]);
      }
    },
    [
      togglePhoto,
      selectedIds,
      selectedCategoryId,
      addToClassicCleaner,
      removeFromClassicCleaner,
    ]
  );

  const handleSelectCategory = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId as PhotoCategory);
    // Don't call original handler as we're handling navigation internally
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    toggleSelectAll();
    const allPhotoIds = photos.map((photo) => photo.id);

    if (isSelectAll) {
      removeFromClassicCleaner(selectedCategoryId, allPhotoIds);
    } else {
      addToClassicCleaner(selectedCategoryId, allPhotoIds);
    }
  }, [
    toggleSelectAll,
    photos,
    isSelectAll,
    selectedCategoryId,
    addToClassicCleaner,
    removeFromClassicCleaner,
  ]);

  const handleCleanFiles = useCallback(() => {
    // TODO: Implement file cleaning logic
    console.log("Cleaning files:", Array.from(selectedIds));
    console.log("Category:", selectedCategoryId);
  }, [selectedIds, selectedCategoryId]);

  const hasSelectedPhotos = selectedIds.size > 0;
  const showBottomButton = hasSelectedPhotos;

  // Determine header button
  const getHeaderAction = () => {
    if (isSelectAll) {
      return {
        label: "Cancel",
        onPress: () => {
          clearSelection();
          clearClassicCleaner(selectedCategoryId);
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

  if (isLoading) {
    return (
      <YStack flex={1} bg="$darkBgAlt">
        <ScreenHeader title="Classic Cleaner" rightAction={getHeaderAction()} />
        <XStack px="$4" pb="$2">
          <CategoryDropdown
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
          />
        </XStack>
        {PhotoCategory.SIMILAR_PHOTOS === selectedCategoryId ? (
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
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
        />
      </XStack>
      {PhotoCategory.SIMILAR_PHOTOS === selectedCategoryId ? (
        <PhotoGroupGrid
          groups={similarPhotos.map((group: Photo[], index: number) => ({
            id: `group-${index}`,
            photos: group,
          }))}
          selectedIds={selectedIds}
          isSelectionMode={false}
          onTogglePhoto={handleTogglePhoto}
          onPreviewPhoto={undefined}
        />
      ) : (
        <PhotoGrid
          photos={photos}
          selectedIds={selectedIds}
          isSelectionMode={false}
          onTogglePhoto={handleTogglePhoto}
          onPreviewPhoto={undefined}
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
            onPress={handleCleanFiles}
            w="100%"
          >
            <Text fs={17} fw="$semibold" color="$white">
              Cleaning files
            </Text>
          </Button>
        </YStack>
      )}
    </YStack>
  );
}
