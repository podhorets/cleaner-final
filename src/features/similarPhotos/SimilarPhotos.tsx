import Checked from "@/assets/images/checked_checkbox.svg";
import Unchecked from "@/assets/images/unchecked_checkbox.svg";
import { Image } from "expo-image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable } from "react-native";
import { Stack, Text, XStack, YStack } from "tamagui";

import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { getSimilarPhotos } from "@/src/services/photoService";
import { Photo } from "@/src/types/models";

const PHOTO_SIZE = 113;
const PHOTO_GAP = 3;
const GROUP_GAP = 15;
const COLUMNS = 3;

type PhotoGroup = {
  id: string;
  photos: Photo[];
};

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

type PhotoGroupItemProps = {
  group: PhotoGroup;
  selectedIds: Set<string>;
  onTogglePhoto: (photoId: string) => void;
};

const PhotoGroupItem = memo(
  ({ group, selectedIds, onTogglePhoto }: PhotoGroupItemProps) => {
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
  }
);

PhotoGroupItem.displayName = "PhotoGroupItem";

export function SimilarPhotos() {
  const [groups, setGroups] = useState<PhotoGroup[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectAll, setIsSelectAll] = useState(false);

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
      groups.forEach((group) => {
        group.photos.forEach((photo) => {
          allIds.add(photo.id);
        });
      });
      setSelectedIds(allIds);
      setIsSelectAll(true);
    }
  }, [isSelectAll, groups]);

  // Update select all state when selection changes
  useEffect(() => {
    const totalPhotos = groups.reduce((sum, group) => sum + group.photos.length, 0);
    setIsSelectAll(totalPhotos > 0 && selectedIds.size === totalPhotos);
  }, [selectedIds, groups]);

  const renderGroup = useCallback(
    ({ item }: { item: PhotoGroup }) => (
      <PhotoGroupItem
        group={item}
        selectedIds={selectedIds}
        onTogglePhoto={togglePhoto}
      />
    ),
    [selectedIds, togglePhoto]
  );

  const keyExtractor = useCallback((item: PhotoGroup) => item.id, []);

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
    </YStack>
  );
}
