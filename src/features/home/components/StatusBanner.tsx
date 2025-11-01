import { Card, Text, XStack, YStack } from "tamagui";

import type { ViewStyle, TextStyle } from "react-native";

type CleaningState = "idle" | "pending" | "completed";

export type StatusBannerProps = {
  state: CleaningState;
  title: string;
  subtitle: string;
};

const toneStyles: Record<CleaningState, { indicator: string; textColor: TextStyle["color"] }> = {
  idle: { indicator: "!", textColor: "#222" },
  pending: { indicator: "--", textColor: "#222" },
  completed: { indicator: "OK", textColor: "#1f7a1f" },
};

const rowStyle: ViewStyle = { alignItems: "center" };

export function StatusBanner({ state, title, subtitle }: StatusBannerProps) {
  const tone = toneStyles[state];

  return (
    <Card padding="$4" borderRadius="$6" bordered>
      <XStack style={rowStyle} space="$3">
        <Text style={{ fontSize: 20, fontWeight: "700", color: tone.textColor }}>
          {tone.indicator}
        </Text>
        <YStack flex={1} space="$1">
          <Text fontSize="$6" fontWeight="700">
            {title}
          </Text>
          <Text color="$color11">{subtitle}</Text>
        </YStack>
      </XStack>
    </Card>
  );
}