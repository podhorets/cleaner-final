import { Cpu, MemoryStick, Thermometer } from "@tamagui/lucide-icons";
import { Card, Progress, Stack, Text, XStack, YStack } from "tamagui";

import { Badge } from "../../../shared/components/Badge";

export function Hardware() {
  return (
    <Card p="$2.5" br="$9" bg="$cardBg" gap="$3" bordered>
      <Text fs={24} fw="$medium" color="$text">
        System
      </Text>
      <YStack gap="$2" flex={1} flexDirection="row">
        <Text color="$text" fs={14} fw="$medium">
          Occupied
        </Text>
        <Text color="$text" fs={14} fw="$light">
          123.8 GB / 216 GB{" "}
        </Text>
      </YStack>
      <Stack>
        <Progress value={65} br="$6" height={26}>
          <Progress.Indicator br="$6" />
        </Progress>
      </Stack>
      <XStack gap="$4.5" justify="center">
        <Badge icon={Thermometer} value="34°C" />
        <Badge icon={Cpu} value="32%" />
        <Badge icon={MemoryStick} value="32 Gb" />
      </XStack>
      <Text color="$text" fs={12} fw="$light">
        IPhone 15 Pro Max - iOS 17
      </Text>
    </Card>
  );
}
