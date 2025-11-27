import { Image, Phone } from "@tamagui/lucide-icons";
import { Card, Text, XStack, YStack } from "tamagui";
import { Badge } from "../../../shared/components/Badge";

const tiles = [
  { id: "img", label: "Images", count: "1 198", icon: Image },
  { id: "ct", label: "Contacts", count: "198", icon: Phone },
];

export function SecretFolder() {
  return (
    <Card
      py="$2.5"
      px="$4"
      br="$9"
      bg="$pink"
      bordered
      onPress={() => {}}
    >
      <YStack gap="$2.5">
        <Text fs={24} fw="500" color="$textDark">
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
              <Text fs={20} fw="$medium" color="$textDark">
                {tile.label}
              </Text>
            </XStack>
          </YStack>
        ))}
      </YStack>
    </Card>
  );
}
