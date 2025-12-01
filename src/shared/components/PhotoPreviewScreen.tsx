import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { YStack } from "tamagui";

import { ScreenHeader } from "@/src/shared/components/ScreenHeader";

export function PhotoPreviewScreen() {
  const router = useRouter();
  const { uri, title } = useLocalSearchParams<{ uri: string; title?: string }>();

  return (
    <YStack flex={1} bg="$darkBgAlt">
      <ScreenHeader title={title || "Photo Preview"} />
      <YStack flex={1} items="center" justify="center" px="$4">
        {uri && (
          <Image
            source={{ uri }}
            style={{ width: "100%", height: "100%", maxHeight: "80%" }}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={200}
          />
        )}
      </YStack>
    </YStack>
  );
}

