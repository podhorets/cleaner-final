import { LinearGradient } from "@tamagui/linear-gradient";
import { Progress, Separator, Text, XStack, YStack } from "tamagui";

export function RamAndCpu() {
  return (
    <XStack gap="$3.5">
      <YStack p="$3.5" gap="$2.5" br="$6" bg="$darkBlueAlpha30">
        <Text color="$white" fs={22} fw="$semibold">
          Ram
        </Text>
        <XStack gap="$1.5">
          <YStack gap="$2">
            <Text color="$textGray" fs={14} fw="$regular">
              Free Ram
            </Text>
            <Text color="$white" fs={15} fw="$medium">
              12 GB
            </Text>
          </YStack>
          <Separator borderColor="$gray1" alignSelf="stretch" vertical />
          <YStack gap="$2">
            <Text color="$textGray" fs={14} fw="$regular">
              Total Ram
            </Text>
            <Text color="$white" fs={15} fw="$medium">
              32 GB
            </Text>
          </YStack>
        </XStack>
        <Progress
          value={60}
          size="$2"
          height={16}
          backgroundColor="$gray2"
          br={20}
        >
          <Progress.Indicator
            animation="bouncy"
            bg="transparent"
            overflow="hidden"
            br={20}
          >
            <LinearGradient
              colors={["rgba(255,114,61,0.63)", "rgba(255,114,61,1)"]}
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

      <YStack p="$3.5" gap="$2.5" br="$6" bg="$darkBlueAlpha30">
        <Text color="$white" fs={22} fw="$semibold">
          CPU
        </Text>
        <YStack gap="$2">
          <Text color="$textGray" fs={14} fw="$regular">
            Usage: 45%
          </Text>
          <Text color="$white" fs={15} fw="$medium">
            3.2 GHz
          </Text>
        </YStack>
        <Progress
          value={60}
          size="$2"
          height={16}
          backgroundColor="$gray2"
          br={20}
        >
          <Progress.Indicator
            animation="bouncy"
            bg="transparent"
            overflow="hidden"
            br={20}
          >
            <LinearGradient
              colors={["rgba(41,204,106,0.36)", "rgba(41,204,106,1)"]}
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
    </XStack>
  );
}
