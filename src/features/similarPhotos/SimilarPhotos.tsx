import { LinearGradient } from "@tamagui/linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Text, XStack, YStack } from "tamagui";

import { getSimilarPhotos } from "@/src/services/photo/similarPhotos";
import { CategoryDropdown } from "@/src/shared/components/CategoryDropdown";
import {
  PhotoGroupGrid,
  type PhotoGroup,
} from "@/src/shared/components/PhotoGrid/PhotoGroupGrid";
import { PhotoGroupGridSkeleton } from "@/src/shared/components/PhotoLoading/PhotoGroupGridSkeleton";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { useCategoryDropdown } from "@/src/shared/hooks/useCategoryDropdown";
import { usePhotoSelection } from "@/src/shared/hooks/usePhotoSelection";
import { categoryToStoreKey, PhotoCategory } from "@/src/shared/types/categories";
import { useDeletionStore } from "@/src/stores/useDeletionStore";
import { Photo } from "@/src/types/models";

export function SimilarPhotos() {
  const router = useRouter();
  const params = useLocalSearchParams<{ selectionModeOnly?: string }>();
  const selectionModeOnly = params.selectionModeOnly === "true";
  
  const [groups, setGroups] = useState<PhotoGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectionMode, setIsSelectionMode] = useState(selectionModeOnly);
  const lastSyncedPhotosRef = useRef<string>("");

  const { categories, handleSelectCategory } =
    useCategoryDropdown(PhotoCategory.SIMILAR_PHOTOS);
  
  const storeCategoryKey = categoryToStoreKey(PhotoCategory.SIMILAR_PHOTOS);
  
  const {
    addToSmartCleaner,
    removeFromSmartCleaner,
    addToClassicCleaner,
    removeFromClassicCleaner,
    clearSmartCleaner,
    clearClassicCleaner,
    getSmartCleanerIds,
    getClassicCleanerIds,
  } = useDeletionStore();

  // Get all photos from groups for selection hook
  const allPhotos = useMemo(() => {
    return groups.flatMap((group) => group.photos);
  }, [groups]);

  const {
    selectedIds,
    isSelectAll,
    togglePhoto,
    toggleSelectAll,
    clearSelection,
  } = usePhotoSelection({ photos: allPhotos });

  // Ensure isSelectionMode stays true when selectionModeOnly is true
  useEffect(() => {
    if (selectionModeOnly) {
      setIsSelectionMode(true);
    }
  }, [selectionModeOnly]);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setIsLoading(true);
        const similarGroups = await getSimilarPhotos(5);
        const photoGroups: PhotoGroup[] = similarGroups.map((group, index) => ({
          id: `group-${index}`,
          photos: group,
        }));
        setGroups(photoGroups);
      } catch (error) {
        console.error("Failed to load similar photos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, []);

  // Sync selectedIds with store when photos are loaded
  useEffect(() => {
    if (allPhotos.length === 0 || isLoading) return;

    // Create a signature for this photo set to avoid re-syncing
    const photosSignature = allPhotos
      .map((p) => p.id)
      .sort()
      .join(",");
    if (lastSyncedPhotosRef.current === photosSignature) return;

    const storeIds = selectionModeOnly
      ? getSmartCleanerIds(storeCategoryKey)
      : getClassicCleanerIds(storeCategoryKey);

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
  }, [allPhotos.length, isLoading, storeCategoryKey, selectionModeOnly]);

  // Wrapper for togglePhoto that syncs with store
  const handleTogglePhoto = useCallback(
    (photoId: string) => {
      // Check current state before toggling
      const willBeSelected = !selectedIds.has(photoId);

      // Toggle the photo selection
      togglePhoto(photoId);

      // Update store based on the new state
      if (selectionModeOnly) {
        if (willBeSelected) {
          addToSmartCleaner(storeCategoryKey, [photoId]);
        } else {
          removeFromSmartCleaner(storeCategoryKey, [photoId]);
        }
      } else {
        if (willBeSelected) {
          addToClassicCleaner(storeCategoryKey, [photoId]);
        } else {
          removeFromClassicCleaner(storeCategoryKey, [photoId]);
        }
      }
    },
    [
      togglePhoto,
      selectedIds,
      selectionModeOnly,
      storeCategoryKey,
      addToSmartCleaner,
      removeFromSmartCleaner,
      addToClassicCleaner,
      removeFromClassicCleaner,
    ]
  );

  const handleSelectPress = useCallback(() => {
    if (!selectionModeOnly) {
      setIsSelectionMode(true);
    }
  }, [selectionModeOnly]);

  const handleCancelPress = useCallback(() => {
    if (selectionModeOnly) {
      // Clear selection but stay in selection mode
      clearSelection();
      clearSmartCleaner(storeCategoryKey);
    } else {
      setIsSelectionMode(false);
      clearSelection();
      clearClassicCleaner(storeCategoryKey);
    }
  }, [
    clearSelection,
    selectionModeOnly,
    storeCategoryKey,
    clearSmartCleaner,
    clearClassicCleaner,
  ]);

  const handlePreviewPhoto = useCallback(
    (photo: Photo) => {
      router.push({
        pathname: "/photo-preview" as any,
        params: { uri: photo.uri, title: "Similar photos" },
      });
    },
    [router]
  );

  const handleToggleSelectAll = useCallback(() => {
    toggleSelectAll();
    const allPhotoIds = allPhotos.map((photo) => photo.id);

    if (selectionModeOnly) {
      if (isSelectAll) {
        removeFromSmartCleaner(storeCategoryKey, allPhotoIds);
      } else {
        addToSmartCleaner(storeCategoryKey, allPhotoIds);
      }
    } else {
      if (isSelectAll) {
        removeFromClassicCleaner(storeCategoryKey, allPhotoIds);
      } else {
        addToClassicCleaner(storeCategoryKey, allPhotoIds);
      }
    }
  }, [
    toggleSelectAll,
    allPhotos,
    isSelectAll,
    selectionModeOnly,
    storeCategoryKey,
    addToSmartCleaner,
    removeFromSmartCleaner,
    addToClassicCleaner,
    removeFromClassicCleaner,
  ]);

  const handleCleanFiles = useCallback(() => {
    // TODO: Implement file cleaning logic
    console.log("Cleaning files:", Array.from(selectedIds));
  }, [selectedIds]);

  const hasSelectedPhotos = selectedIds.size > 0;
  const showBottomButton = isSelectionMode && hasSelectedPhotos && !selectionModeOnly;

  // Determine header button
  const getHeaderAction = () => {
    // When selectionModeOnly is true, always show Select All / Cancel
    const inSelectionMode = isSelectionMode || selectionModeOnly;

    if (!inSelectionMode) {
      return {
        label: "Select",
        onPress: handleSelectPress,
        color: "blue" as const,
      };
    }
    if (isSelectAll) {
      return {
        label: "Cancel",
        onPress: handleCancelPress,
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
        <ScreenHeader title="Similar photos" rightAction={getHeaderAction()} />
        {!selectionModeOnly && (
          <XStack px="$4" pb="$2">
            <CategoryDropdown
              categories={categories}
              selectedCategoryId={PhotoCategory.SIMILAR_PHOTOS}
              onSelectCategory={handleSelectCategory}
            />
          </XStack>
        )}
        <PhotoGroupGridSkeleton />
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$darkBgAlt">
      <ScreenHeader title="Similar photos" rightAction={getHeaderAction()} />
      {!selectionModeOnly && (
        <XStack px="$4" pb="$2">
          <CategoryDropdown
            categories={categories}
            selectedCategoryId={PhotoCategory.SIMILAR_PHOTOS}
            onSelectCategory={handleSelectCategory}
          />
        </XStack>
      )}
      <PhotoGroupGrid
        groups={groups}
        selectedIds={selectedIds}
        isSelectionMode={isSelectionMode || selectionModeOnly}
        onTogglePhoto={
          isSelectionMode || selectionModeOnly ? handleTogglePhoto : undefined
        }
        onPreviewPhoto={
          !(isSelectionMode || selectionModeOnly)
            ? handlePreviewPhoto
            : undefined
        }
      />
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
