import { Text, XStack } from "tamagui";

import ArrowRight from "@/assets/images/arrow_right.svg";
import { Image } from "expo-image";
import { router } from "expo-router";

export function SpeedTest() {
  return (
    <XStack
      p="$3.5"
      items="center"
      justify="space-between"
      bg="$darkBlueAlpha30"
      br="$6"
      onPress={() => router.push("/internet-speed" as any)}
    >
      <Text fs={26} fw="$medium" color="$white">
        Speed test
      </Text>
      <Image
        source={ArrowRight}
        style={{ width: 24, height: 24 }}
        contentFit="contain"
      />
    </XStack>
  );
}
