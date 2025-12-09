import { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import { Text, YStack } from "tamagui";

import { COLUMNS, GROUP_GAP } from "@/src/shared/components/PhotoGrid/constants";
import { PhotoRow } from "@/src/shared/components/PhotoGrid/PhotoRow";
import { Photo } from "@/src/types/models";

export type PhotoGroup = {
  id: string;
  photos: Photo[];
};

type PhotoGroupItemProps = {
  group: PhotoGroup;
  isSelectionMode: boolean;
  onTogglePhoto?: (photoId: string) => void;
  onPreviewPhoto?: (photo: Photo) => void;
};

const PhotoGroupItem = ({
  group,
  isSelectionMode,
  onTogglePhoto,
  onPreviewPhoto,
}: PhotoGroupItemProps) => {
  const rows: Photo[][] = useMemo(() => {
    const result: Photo[][] = [];
    for (let i = 0; i < group.photos.length; i += COLUMNS) {
      result.push(group.photos.slice(i, i + COLUMNS));
    }
    return result;
  }, [group.photos]);

  return (
    <YStack gap={3} items="center">
      {/* Count Label */}
      <Text fs={15} fw="$medium" color="$blueTertiary">
        {group.photos.length} items
      </Text>

      {/* Photo Grid */}
      <YStack gap={3}>
        {rows.map((row, rowIndex) => (
          <PhotoRow
            key={rowIndex}
            photos={row}
            isSelectionMode={isSelectionMode}
            onTogglePhoto={onTogglePhoto}
            onPreviewPhoto={onPreviewPhoto}
          />
        ))}
      </YStack>
    </YStack>
  );
};

type PhotoGroupGridProps = {
  groups: PhotoGroup[];
  isSelectionMode: boolean;
  onTogglePhoto?: (photoId: string) => void;
  onPreviewPhoto?: (photo: Photo) => void;
};

export function PhotoGroupGrid({
  groups,
  isSelectionMode,
  onTogglePhoto,
  onPreviewPhoto,
}: PhotoGroupGridProps) {
  const renderGroup = useCallback(
    ({ item }: { item: PhotoGroup }) => (
      <PhotoGroupItem
        group={item}
        isSelectionMode={isSelectionMode}
        onTogglePhoto={onTogglePhoto}
        onPreviewPhoto={onPreviewPhoto}
      />
    ),
    [isSelectionMode, onTogglePhoto, onPreviewPhoto]
  );

  const keyExtractor = useCallback((item: PhotoGroup) => item.id, []);

  return (
    <FlatList
      data={groups}
      renderItem={renderGroup}
      keyExtractor={keyExtractor}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 100,
        gap: GROUP_GAP,
      }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={100}
      initialNumToRender={3}
      windowSize={5}
    />
  );
}
