import { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import { Stack, Text, XStack, YStack } from "tamagui";

import { PhotoItem } from "@/src/shared/components/PhotoItem";
import { Photo } from "@/src/types/models";

const PHOTO_SIZE = 113;
const PHOTO_GAP = 3;
const GROUP_GAP = 15;
const COLUMNS = 3;

export type PhotoGroup = {
  id: string;
  photos: Photo[];
};

type PhotoGroupItemProps = {
  group: PhotoGroup;
  selectedIds: Set<string>;
  onTogglePhoto: (photoId: string) => void;
};

const PhotoGroupItem = ({
  group,
  selectedIds,
  onTogglePhoto,
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
          <XStack key={rowIndex} gap={3}>
            {row.map((photo) => (
              <PhotoItem
                key={photo.id}
                photo={photo}
                isSelected={selectedIds.has(photo.id)}
                onToggle={onTogglePhoto}
              />
            ))}
            {/* Fill remaining columns with empty space */}
            {row.length < COLUMNS &&
              Array.from({ length: COLUMNS - row.length }).map((_, i) => (
                <Stack key={`empty-${i}`} width={PHOTO_SIZE} height={PHOTO_SIZE} />
              ))}
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
};

type PhotoGroupGridProps = {
  groups: PhotoGroup[];
  selectedIds: Set<string>;
  onTogglePhoto: (photoId: string) => void;
};

export function PhotoGroupGrid({
  groups,
  selectedIds,
  onTogglePhoto,
}: PhotoGroupGridProps) {
  const renderGroup = useCallback(
    ({ item }: { item: PhotoGroup }) => (
      <PhotoGroupItem
        group={item}
        selectedIds={selectedIds}
        onTogglePhoto={onTogglePhoto}
      />
    ),
    [selectedIds, onTogglePhoto]
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

