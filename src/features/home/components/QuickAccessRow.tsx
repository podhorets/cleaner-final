import { Card, Text, XStack, YStack } from "tamagui";

type QuickLink = {
  id: string;
  label: string;
  count: string;
  onPress?: () => void;
};

const links = [
  { id: "images", label: "Images", count: "1 198", onPress: () => {} },
  { id: "contacts", label: "Contacts", count: "842", onPress: () => {} },
] as QuickLink[];

export function QuickAccessRow() {
  return (
    <XStack gap="$3.5">
      {links.map((item) => (
        <QuickLinkCard key={item.id} {...item} />
      ))}
    </XStack>
  );
}

function QuickLinkCard({ label, count, onPress }: QuickLink) {
  return (
    <Card
      flex={1}
      padding="$4"
      borderRadius="$9"
      bg="$cardBg"
      bordered
      onPress={onPress}
    >
      <YStack gap="$2">
        <Text color="$text" fontSize={20} fontWeight="$medium">
          {label}
        </Text>

        <XStack
          alignSelf="flex-start"
          p="$2"
          bg="$text"
          borderRadius="$6"
          ai="center"
          opacity={0.8}
        >
          <Text color="$background" fontSize={12} fontWeight="$regular">
            {count} items
          </Text>
        </XStack>
      </YStack>
    </Card>
  );
}
