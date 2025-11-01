import { Card, Text, XStack, YStack } from "tamagui";

import type { ViewStyle } from "react-native";

type UtilityAction = {
  id: string;
  label: string;
};

export type UtilityActionsRowProps = {
  actions: UtilityAction[];
};

const rowStyle: ViewStyle = { justifyContent: "space-between" };
const tileStyle: ViewStyle = { alignItems: "center" };
const iconStyle: ViewStyle = {
  width: 56,
  height: 56,
  borderRadius: 28,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#e8e8f1",
};

export function UtilityActionsRow({ actions }: UtilityActionsRowProps) {
  return (
    <Card padding="$4" borderRadius="$6" bordered>
      <XStack style={rowStyle}>
        {actions.map((action) => (
          <YStack key={action.id} style={tileStyle} space="$2">
            <Card style={iconStyle}>
              <Text fontSize="$5" fontWeight="700">
                {action.label}
              </Text>
            </Card>
            <Text fontSize="$3" color="$color11">
              {action.id}
            </Text>
          </YStack>
        ))}
      </XStack>
    </Card>
  );
}