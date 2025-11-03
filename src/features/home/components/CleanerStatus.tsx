import { Card, Text, XStack, YStack } from "tamagui";

export function CleanerStatus() {
  return (
    <Card p="$2.5" br="$9" bg="$mainCardBg" bordered>
      <XStack items="center" gap="$3.5">
        <Text width={44} height={38}>
          X
        </Text>
        <YStack flex={1} gap="$2">
          <Text color="$hsText" fs="$6" fw="$medium">
            No Cleaning
          </Text>
          <Text color="$hsText" fw="$light" o={0.5}>
            Clean your phone
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
}
