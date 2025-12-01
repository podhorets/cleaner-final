import { useCallback, useMemo } from "react";
import { FlatList } from "react-native";

import { PhotoRow } from "@/src/shared/components/PhotoRow";
import { Photo } from "@/src/types/models";

const PHOTO_GAP = 3;
const COLUMNS = 3;

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
  // Group photos into rows
  const rows: Photo[][] = useMemo(() => {
    const result: Photo[][] = [];
    for (let i = 0; i < photos.length; i += COLUMNS) {
      result.push(photos.slice(i, i + COLUMNS));
    }
    return result;
  }, [photos]);

  const renderRow = useCallback(
    ({ item }: { item: Photo[] }) => (
      <PhotoRow
        photos={item}
        selectedIds={selectedIds}
        isSelectionMode={isSelectionMode}
        onTogglePhoto={onTogglePhoto}
        onPreviewPhoto={onPreviewPhoto}
      />
    ),
    [selectedIds, isSelectionMode, onTogglePhoto, onPreviewPhoto]
  );

  const keyExtractor = useCallback(
    (_: Photo[], index: number) => `row-${index}`,
    []
  );

  return (
    <FlatList
      data={rows}
      renderItem={renderRow}
      keyExtractor={keyExtractor}
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
