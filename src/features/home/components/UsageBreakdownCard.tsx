import { Button, Card, Progress, Text, XStack, YStack } from "tamagui";

import type { ViewStyle } from "react-native";

type UsageSlice = {
  label: string;
  value: number;
  color: string;
};

export type UsageBreakdownCardProps = {
  slices: UsageSlice[];
  totalUsed: string;
  totalCapacity: string;
  onSmartCleanPress?: () => void;
};

const rowStyle: ViewStyle = { alignItems: "center" };
const dotStyle: ViewStyle = {
  width: 12,
  height: 12,
  borderRadius: 6,
};
const progressStyle: ViewStyle = {
  height: 10,
  borderRadius: 5,
};
const progressIndicatorStyle: ViewStyle = {
  borderRadius: 5,
};

export function UsageBreakdownCard({
  slices,
  totalUsed,
  totalCapacity,
  onSmartCleanPress,
}: UsageBreakdownCardProps) {
  return (
    <Card padding="$4" borderRadius="$6" space="$4" bordered>
      <YStack space="$3">
        <Text fontSize="$6" fontWeight="700">
          Storage breakdown
        </Text>
        <YStack space="$2">
          {slices.map((slice) => (
            <XStack key={slice.label} style={rowStyle} space="$3">
              <Card style={[dotStyle, { backgroundColor: slice.color }]} />
              <Text flex={1}>{slice.label}</Text>
              <Text color="$color11">{slice.value}%</Text>
            </XStack>
          ))}
        </YStack>
        <YStack space="$2">
          <Text color="$color11">
            {totalUsed} of {totalCapacity} used
          </Text>
          <Progress value={65} style={progressStyle}>
            <Progress.Indicator style={progressIndicatorStyle} />
          </Progress>
        </YStack>
        <Button onPress={onSmartCleanPress}>
          Start smart clean
        </Button>
      </YStack>
    </Card>
  );
}