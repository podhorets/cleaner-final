import { LinearGradient } from "@tamagui/linear-gradient";
import { Progress, Separator, Text, XStack, YStack } from "tamagui";

export function Hardware() {
  return (
    <YStack p="$3.5" gap="$2.5" br="$6" bg="#4248654d">
      <Text fs={24} fw="$medium" color="$hsText">
        Storage
      </Text>
      <XStack gap="$1.5">
        <YStack gap="$2">
          <Text color="#929296" fs={14} fw="$regular">
            Free Storage
          </Text>
          <Text color="$hsText" fs={15} fw="$medium">
            52 GB
          </Text>
        </YStack>
        <Separator borderColor="#46464D" alignSelf="stretch" vertical />
        <YStack gap="$2">
          <Text color="#929296" fs={14} fw="$regular">
            Total Storage
          </Text>
          <Text color="$hsText" fs={15} fw="$medium">
            256 GB
          </Text>
        </YStack>
      </XStack>
      <Progress
        value={60}
        size="$2"
        height={16}
        backgroundColor="#acacac4d"
        br={20}
      >
        <Progress.Indicator
          animation="bouncy"
          bg="transparent"
          overflow="hidden"
          br={20}
        >
          <LinearGradient
            colors={["rgba(3,133,255,0.63)", "rgba(3,133,255,1)"]}
            start={[0, 0.5]}
            end={[1, 0.5]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </Progress.Indicator>
      </Progress>
    </YStack>
  );
}
