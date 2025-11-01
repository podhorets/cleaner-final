import { Card, Text, XStack, YStack } from "tamagui";

import type { ViewStyle } from "react-native";

type SystemMetric = {
  id: string;
  label: string;
  value: string;
};

export type SystemOverviewCardProps = {
  deviceName: string;
  osVersion: string;
  occupancyLabel: string;
  metrics: SystemMetric[];
};

const metricsRowStyle: ViewStyle = { justifyContent: "space-between" };
const metricColumnStyle: ViewStyle = { flex: 1 };

export function SystemOverviewCard({
  deviceName,
  osVersion,
  occupancyLabel,
  metrics,
}: SystemOverviewCardProps) {
  return (
    <Card padding="$4" borderRadius="$6" space="$3" bordered>
      <YStack space="$2">
        <Text fontSize="$6" fontWeight="700">
          System
        </Text>
        <Text color="$color11">{occupancyLabel}</Text>
      </YStack>
      <XStack style={metricsRowStyle} space="$3">
        {metrics.map((metric) => (
          <YStack key={metric.id} style={metricColumnStyle} space="$1">
            <Text fontSize="$4" fontWeight="700">
              {metric.value}
            </Text>
            <Text color="$color11">{metric.label}</Text>
          </YStack>
        ))}
      </XStack>
      <Text color="$color11">
        {deviceName} - {osVersion}
      </Text>
    </Card>
  );
}