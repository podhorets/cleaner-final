import { useCallback, useEffect, useState } from "react";
import { Text, YStack } from "tamagui";

import { getScreenshots } from "@/src/services/photoService";
import { PhotoGrid } from "@/src/shared/components/PhotoGrid";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(!providedPhotos);
  const [isSelectAll, setIsSelectAll] = useState(false);

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

  const togglePhoto = useCallback((photoId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (isSelectAll) {
      setSelectedIds(new Set());
      setIsSelectAll(false);
    } else {
      const allIds = new Set<string>();
      photos.forEach((photo) => {
        allIds.add(photo.id);
      });
      setSelectedIds(allIds);
      setIsSelectAll(true);
    }
  }, [isSelectAll, photos]);

  // Update select all state when selection changes
  useEffect(() => {
    setIsSelectAll(photos.length > 0 && selectedIds.size === photos.length);
  }, [selectedIds, photos.length]);

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

// Convenience component for Screenshots
export function Screenshots() {
  return <PhotoGridScreen title="Screenshots" onLoadPhotos={getScreenshots} />;
}
