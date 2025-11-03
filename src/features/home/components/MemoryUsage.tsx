import { useRouter } from "expo-router";
import { Button, Card, Text, YStack } from "tamagui";

export function MemoryUsage() {
  const router = useRouter();

  return (
    <Card px="$5" py="$2.5" br="$9" bg="$mainCardBg" bordered>
      <YStack gap="$4.5">
        {/* <YStack>
          <Text height={180}>diagrams</Text>
        </YStack> */}
        <Button
          onPress={() => {}}
          bg="$hsSmartCleanButtonBg"
          br="$10"
          size="$5"
        >
          <YStack
            gap="$1"
            items="center"
            onPress={() => router.push("/smart-clean")}
          >
            <Text fs={16} fw="$medium" o={0.6}>
              Use smart clean
            </Text>
            <Text fs={20} fw="$medium">
              START SMART CLEAN
            </Text>
          </YStack>
        </Button>
      </YStack>
    </Card>
  );
}
