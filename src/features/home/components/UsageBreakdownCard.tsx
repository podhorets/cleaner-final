import { Button, Card, Text, YStack } from "tamagui";

export type UsageBreakdownCardProps = {};

export function UsageBreakdownCard({}: UsageBreakdownCardProps) {
  return (
    <Card px="$5" py="$2.5" borderRadius="$9" bg="$cardBg" bordered>
      <YStack gap="$4.5">
        {/* <YStack>
          <Text height={180}>diagrams</Text>
        </YStack> */}
        <Button
          onPress={() => {}}
          bg="$smartCleanerBg"
          borderRadius="$10"
          size="$5"
        >
          <YStack gap="$1" items="center">
            <Text fontSize={16} fontWeight="$medium" opacity={0.6}>
              Use smart clean
            </Text>
            <Text fontSize={20} fontWeight="$medium">
              START SMART CLEAN
            </Text>
          </YStack>
        </Button>
      </YStack>
    </Card>
  );
}
