import { Card, Text, XStack, YStack } from "tamagui";

import type { ViewStyle } from "react-native";

type SecretTile = {
  id: string;
  label: string;
  count: string;
  emphasis?: "primary" | "secondary";
  onPress?: () => void;
};

export type SecretFolderSectionProps = {
  tiles: SecretTile[];
};

const headerStyle: ViewStyle = {
  alignItems: "center",
  justifyContent: "space-between",
};

export function SecretFolderSection({ tiles }: SecretFolderSectionProps) {
  return (
    <YStack space="$3">
      <XStack style={headerStyle}>
        <Text fontSize="$6" fontWeight="700">
          Secret Folder
        </Text>
        <Text color="$color11">See all</Text>
      </XStack>
      <XStack space="$3">
        {tiles.map((tile) => (
          <Card
            key={tile.id}
            flex={1}
            padding="$4"
            borderRadius="$6"
            bordered
            backgroundColor={tile.emphasis === "primary" ? "#3e2b7d" : undefined}
          >
            <YStack space="$1">
              <Text fontSize="$2" color="$color11">
                {tile.count}
              </Text>
              <Text fontSize="$5" fontWeight="700">
                {tile.label}
              </Text>
            </YStack>
          </Card>
        ))}
      </XStack>
    </YStack>
  );
}