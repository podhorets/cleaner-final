import { Card, Text, XStack } from "tamagui";

import type { ViewStyle } from "react-native";

type NavItem = {
  id: string;
  label: string;
  active?: boolean;
};

export type BottomNavigationBarProps = {
  items: NavItem[];
};

const rowStyle: ViewStyle = {
  alignItems: "center",
  justifyContent: "space-around",
};

export function BottomNavigationBar({ items }: BottomNavigationBarProps) {
  return (
    <Card padding="$3" borderRadius="$10" bordered>
      <XStack style={rowStyle}>
        {items.map((item) => (
          <Text
            key={item.id}
            fontWeight={item.active ? "700" : "400"}
            color={item.active ? "$blue10" : "$color11"}
          >
            {item.label}
          </Text>
        ))}
      </XStack>
    </Card>
  );
}