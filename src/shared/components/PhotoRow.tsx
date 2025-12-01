import { memo } from "react";
import { Stack, XStack } from "tamagui";

import { PhotoItem } from "@/src/shared/components/PhotoItem";
import { Photo } from "@/src/types/models";

const PHOTO_SIZE = 113;
const PHOTO_GAP = 3;
const COLUMNS = 3;

type PhotoRowProps = {
  photos: Photo[];
  selectedIds: Set<string>;
  isSelectionMode: boolean;
  onTogglePhoto?: (photoId: string) => void;
  onPreviewPhoto?: (photo: Photo) => void;
};

export const PhotoRow = memo(({ photos, selectedIds, isSelectionMode, onTogglePhoto, onPreviewPhoto }: PhotoRowProps) => {
  return (
    <XStack gap={PHOTO_GAP}>
      {photos.map((photo) => (
        <PhotoItem
          key={photo.id}
          photo={photo}
          isSelected={selectedIds.has(photo.id)}
          isSelectionMode={isSelectionMode}
          onToggle={onTogglePhoto}
          onPreview={onPreviewPhoto}
        />
      ))}
      {/* Fill remaining columns with empty space */}
      {photos.length < COLUMNS &&
        Array.from({ length: COLUMNS - photos.length }).map((_, i) => (
          <Stack key={`empty-${i}`} width={PHOTO_SIZE} height={PHOTO_SIZE} />
        ))}
    </XStack>
  );
});

PhotoRow.displayName = "PhotoRow";

