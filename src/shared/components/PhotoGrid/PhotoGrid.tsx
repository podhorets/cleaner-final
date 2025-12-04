import { useCallback } from "react";
import { FlatList } from "react-native";

import { COLUMNS, PHOTO_GAP } from "@/src/shared/components/PhotoGrid/constants";
import { PhotoItem } from "@/src/shared/components/PhotoGrid/PhotoItem";
import { Photo } from "@/src/types/models";

type PhotoGridProps = {
  photos: Photo[];
  selectedIds: Set<string>;
  isSelectionMode: boolean;
  onTogglePhoto?: (photoId: string) => void;
  onPreviewPhoto?: (photo: Photo) => void;
};

export function PhotoGrid({
  photos,
  selectedIds,
  isSelectionMode,
  onTogglePhoto,
  onPreviewPhoto,
}: PhotoGridProps) {
  const renderItem = useCallback(
    ({ item }: { item: Photo }) => (
      <PhotoItem
        photo={item}
        isSelected={selectedIds.has(item.id)}
        isSelectionMode={isSelectionMode}
        onToggle={onTogglePhoto}
        onPreview={onPreviewPhoto}
      />
    ),
    [selectedIds, isSelectionMode, onTogglePhoto, onPreviewPhoto]
  );

  const keyExtractor = useCallback((item: Photo) => item.id, []);

  return (
    <FlatList
      data={photos}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={COLUMNS}
      columnWrapperStyle={{ gap: PHOTO_GAP }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 100,
        gap: PHOTO_GAP,
      }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
    />
  );
}
