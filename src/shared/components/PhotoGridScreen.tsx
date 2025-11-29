import { useEffect, useState } from "react";
import { Text, YStack } from "tamagui";

import { PhotoGrid } from "@/src/shared/components/PhotoGrid";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { usePhotoSelection } from "@/src/shared/hooks/usePhotoSelection";
import { Photo } from "@/src/types/models";

type PhotoGridScreenProps = {
  photos?: Photo[];
  title: string;
  onLoadPhotos?: () => Promise<string[]>;
};

export function PhotoGridScreen({
  photos: providedPhotos,
  title,
  onLoadPhotos,
}: PhotoGridScreenProps) {
  const [photos, setPhotos] = useState<Photo[]>(providedPhotos || []);
  const [isLoading, setIsLoading] = useState(!providedPhotos);

  const { selectedIds, isSelectAll, togglePhoto, toggleSelectAll } =
    usePhotoSelection({ photos });

  useEffect(() => {
    if (providedPhotos) {
      setPhotos(providedPhotos);
      setIsLoading(false);
      return;
    }

    if (!onLoadPhotos) return;

    const loadPhotos = async () => {
      try {
        setIsLoading(true);
        const uris = await onLoadPhotos();
        // Convert URIs to Photo objects, using URI as ID
        const photoObjects: Photo[] = uris.map((uri, index) => ({
          id: uri || `photo-${index}`,
          uri,
        }));
        setPhotos(photoObjects);
      } catch (error) {
        console.error(`Failed to load photos for ${title}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, [providedPhotos, onLoadPhotos, title]);

  if (isLoading) {
    return (
      <YStack flex={1} bg="$darkBgAlt">
        <ScreenHeader title={title} />
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
        title={title}
        rightAction={{
          label: isSelectAll ? "Deselect All" : "Select All",
          onPress: toggleSelectAll,
        }}
      />
      <PhotoGrid
        photos={photos}
        selectedIds={selectedIds}
        onTogglePhoto={togglePhoto}
      />
    </YStack>
  );
}

