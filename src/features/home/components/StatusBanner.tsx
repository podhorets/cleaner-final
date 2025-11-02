import { Card, Text, XStack, YStack } from "tamagui";

export type StatusBannerProps = {};

export function StatusBanner({}: StatusBannerProps) {
  return (
    <Card padding="$2.5" borderRadius="$9" bg="$cardBg" bordered>
      <XStack items="center" gap="$3.5">
        <Text width={44} height={38}>
          X
        </Text>
        <YStack flex={1} gap="$2">
          <Text color="$text" fontSize="$6" fontWeight="$medium">
            No Cleaning
          </Text>
          <Text color="$text" fontWeight="$medium" opacity={0.5}>
            Clean your phone
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
}
