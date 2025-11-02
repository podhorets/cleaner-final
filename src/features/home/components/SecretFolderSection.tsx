import { Image, Phone } from "@tamagui/lucide-icons";
import { Card, Text, XStack, YStack } from "tamagui";
import { Badge } from "./Badge";

const tiles = [
  { id: "img", label: "Images", count: "1 198", icon: Image },
  { id: "ct", label: "Contacts", count: "198", icon: Phone },
];

export function SecretFolderSection() {
  return (
    <Card
      py="$2.5"
      px="$4"
      borderRadius="$9"
      bg="$secretFolderBg"
      bordered
      onPress={() => {}}
    >
      <YStack gap="$2.5">
        <Text fontSize={24} fontWeight="500" color="$text">
          Secret Folder
        </Text>
        {tiles.map((tile) => (
          <YStack key={tile.id} gap="$2">
            <XStack gap="$4">
              {/* left side badge */}
              <Badge
                icon={tile.icon}
                value={`${tile.count} items`}
                useMinWidth={true}
              />

              {/* right side label */}
              <Text fontSize={20} fontWeight="$medium" color="$text">
                {tile.label}
              </Text>
            </XStack>
          </YStack>
        ))}
      </YStack>
    </Card>
  );
}
