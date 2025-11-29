import { Text, XStack } from "tamagui";

import ArrowRight from "@/assets/images/arrow_right.svg";
import { Image } from "expo-image";

export function SystemInfo() {
  return (
    <XStack
      p="$3.5"
      items="center"
      justify="space-between"
      bg="$darkBlueAlpha30"
      br="$6"
    >
      <Text fs={26} fw="$medium" color="$white">
        System info
      </Text>
      <Image
        source={ArrowRight}
        style={{ width: 24, height: 24 }}
        contentFit="contain"
      />
    </XStack>
  );
}
