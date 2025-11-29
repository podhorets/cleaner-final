import Checked from "@/assets/images/checked_checkbox.svg";
import { Image } from "expo-image";
import { memo, useCallback } from "react";
import { Pressable } from "react-native";
import { Stack } from "tamagui";

import { Photo } from "@/src/types/models";

const PHOTO_SIZE = 113;

type PhotoItemProps = {
  photo: Photo;
  isSelected: boolean;
  onToggle: (photoId: string) => void;
};

export const PhotoItem = memo(({ photo, isSelected, onToggle }: PhotoItemProps) => {
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

