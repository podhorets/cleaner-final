import { Cpu, MemoryStick, Thermometer } from "@tamagui/lucide-icons";
import { Card, Progress, Stack, Text, XStack, YStack } from "tamagui";

import { Badge } from "./Badge";

type SystemMetric = {
  id: string;
  label: string;
  value: string;
};

export type SystemOverviewCardProps = {};

export function SystemOverviewCard({}: SystemOverviewCardProps) {
  return (
    <Card padding="$2.5" borderRadius="$9" bg="$cardBg" gap="$3" bordered>
      <Text fontSize={24} fontWeight="500" color="$text">
        System
      </Text>
      <YStack gap="$2" flex={1} flexDirection="row">
        <Text color="$text" fontSize={14} fontWeight="$medium">
          Occupied
        </Text>
        <Text color="$text" fontSize={14} fontWeight="$light">
          123.8 GB / 216 GB{" "}
        </Text>
      </YStack>
      <Stack>
        <Progress value={65} borderRadius="$6" height={26}>
          <Progress.Indicator borderRadius="$6" />
        </Progress>
      </Stack>
      <XStack gap="$4.5" justify="center">
        <Badge icon={Thermometer} value="34°C" />
        <Badge icon={Cpu} value="32%" />
        <Badge icon={MemoryStick} value="32 Gb" />
      </XStack>
      <Text color="$text" fontSize={12} fontWeight="$light">
        IPhone 15 Pro Max - iOS 17
      </Text>
    </Card>
  );
}
