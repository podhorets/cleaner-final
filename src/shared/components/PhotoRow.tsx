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
  onTogglePhoto: (photoId: string) => void;
};

export const PhotoRow = memo(({ photos, selectedIds, onTogglePhoto }: PhotoRowProps) => {
  return (
    <XStack gap={PHOTO_GAP}>
      {photos.map((photo) => (
        <PhotoItem
          key={photo.id}
          photo={photo}
          isSelected={selectedIds.has(photo.id)}
          onToggle={onTogglePhoto}
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

