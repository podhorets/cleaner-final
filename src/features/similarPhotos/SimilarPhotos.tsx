import { LinearGradient } from "@tamagui/linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Text, XStack, YStack } from "tamagui";

import { getSimilarPhotos } from "@/src/services/photoService";
import { CategoryDropdown } from "@/src/shared/components/CategoryDropdown";
import {
  PhotoGroupGrid,
  type PhotoGroup,
} from "@/src/shared/components/PhotoGroupGrid";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { useCategoryDropdown } from "@/src/shared/hooks/useCategoryDropdown";
import { usePhotoSelection } from "@/src/shared/hooks/usePhotoSelection";
import { Photo } from "@/src/types/models";

export function SimilarPhotos() {
  const router = useRouter();
  const [groups, setGroups] = useState<PhotoGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const { categories, handleSelectCategory } = useCategoryDropdown("similar-photos");

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

  const handleSelectPress = useCallback(() => {
    setIsSelectionMode(true);
  }, []);

  const handleCancelPress = useCallback(() => {
    setIsSelectionMode(false);
    clearSelection();
  }, [clearSelection]);

  const handlePreviewPhoto = useCallback(
    (photo: Photo) => {
      router.push({
        pathname: "/photo-preview" as any,
        params: { uri: photo.uri, title: "Similar photos" },
      });
    },
    [router]
  );

  const handleCleanFiles = useCallback(() => {
    // TODO: Implement file cleaning logic
    console.log("Cleaning files:", Array.from(selectedIds));
  }, [selectedIds]);

  const hasSelectedPhotos = selectedIds.size > 0;
  const showBottomButton = isSelectionMode && hasSelectedPhotos;

  // Determine header button
  const getHeaderAction = () => {
    if (!isSelectionMode) {
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
      onPress: toggleSelectAll,
      color: "blue" as const,
    };
  };

  if (isLoading) {
    return (
      <YStack flex={1} bg="$darkBgAlt">
        <ScreenHeader title="Similar photos" />
        <YStack flex={1} items="center" justify="center">
          <Text fs={16} fw="$regular" color="$white">
            Loading photos...
          </Text>
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$darkBgAlt">
      <ScreenHeader title="Similar photos" rightAction={getHeaderAction()} />
      <XStack px="$4" pb="$2">
        <CategoryDropdown
          categories={categories}
          selectedCategoryId="similar-photos"
          onSelectCategory={handleSelectCategory}
        />
      </XStack>
      <PhotoGroupGrid
        groups={groups}
        selectedIds={selectedIds}
        isSelectionMode={isSelectionMode}
        onTogglePhoto={isSelectionMode ? togglePhoto : undefined}
        onPreviewPhoto={!isSelectionMode ? handlePreviewPhoto : undefined}
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
