import Checked from "@/assets/images/checked_checkbox.svg";
import Unchecked from "@/assets/images/unchecked_checkbox.svg";
import { Image } from "expo-image";
import { memo, useCallback, useMemo } from "react";
import { FlatList, Pressable } from "react-native";
import { Stack, XStack, YStack } from "tamagui";

import { Photo } from "@/src/types/models";

const PHOTO_SIZE = 113;
const PHOTO_GAP = 3;
const COLUMNS = 3;

type PhotoItemProps = {
  photo: Photo;
  isSelected: boolean;
  onToggle: (photoId: string) => void;
};

const PhotoItem = memo(({ photo, isSelected, onToggle }: PhotoItemProps) => {
  const handlePress = useCallback(() => {
    onToggle(photo.id);
  }, [photo.id, onToggle]);

  return (
    <Pressable onPress={handlePress} style={{ position: "relative" }}>
      <Image
        source={{ uri: photo.uri }}
        style={{
          width: PHOTO_SIZE,
          height: PHOTO_SIZE,
          borderRadius: 16,
        }}
        contentFit="cover"
        cachePolicy="memory-disk"
        recyclingKey={photo.id}
        transition={200}
      />
      <Stack
        position="absolute"
        top={10}
        right={10}
        bg={isSelected ? "$blueTertiary" : "rgba(234,234,234,0.3)"}
        borderWidth={isSelected ? 0 : 2}
        borderColor="rgba(245,245,245,0.6)"
        br="$2"
        width={24}
        height={24}
        items="center"
        justify="center"
      >
        {isSelected && (
          <Image
            source={Checked}
            style={{ width: 12, height: 12 }}
            contentFit="contain"
          />
        )}
      </Stack>
    </Pressable>
  );
});

PhotoItem.displayName = "PhotoItem";

type PhotoRowProps = {
  photos: Photo[];
  selectedIds: Set<string>;
  onTogglePhoto: (photoId: string) => void;
};

const PhotoRow = memo(({ photos, selectedIds, onTogglePhoto }: PhotoRowProps) => {
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

type PhotoGridProps = {
  photos: Photo[];
  selectedIds: Set<string>;
  onTogglePhoto: (photoId: string) => void;
};

export function PhotoGrid({
  photos,
  selectedIds,
  onTogglePhoto,
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
        onTogglePhoto={onTogglePhoto}
      />
    ),
    [selectedIds, onTogglePhoto]
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
