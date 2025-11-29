import { useEffect, useMemo, useState } from "react";
import { Text, YStack } from "tamagui";

import { PhotoGroupGrid, type PhotoGroup } from "@/src/shared/components/PhotoGroupGrid";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { usePhotoSelection } from "@/src/shared/hooks/usePhotoSelection";
import { getSimilarPhotos } from "@/src/services/photoService";

export function SimilarPhotos() {
  const [groups, setGroups] = useState<PhotoGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get all photos from groups for selection hook
  const allPhotos = useMemo(() => {
    return groups.flatMap((group) => group.photos);
  }, [groups]);

  const { selectedIds, isSelectAll, togglePhoto, toggleSelectAll } =
    usePhotoSelection({ photos: allPhotos });

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
      <ScreenHeader
        title="Similar photos"
        rightAction={{
          label: isSelectAll ? "Deselect All" : "Select All",
          onPress: toggleSelectAll,
        }}
      />
      <PhotoGroupGrid
        groups={groups}
        selectedIds={selectedIds}
        onTogglePhoto={togglePhoto}
      />
    </YStack>
  );
}
