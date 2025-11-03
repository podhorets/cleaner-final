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
    <Card flex={1} p="$4" br="$9" bg="$cardBg" bordered onPress={onPress}>
      <YStack gap="$2">
        <Text color="$text" fs={20} fw="$medium">
          {label}
        </Text>

        <XStack
          alignSelf="flex-start"
          p="$2"
          bg="$text"
          br="$6"
          ai="center"
          o={0.8}
        >
          <Text color="$bg" fs={12} fw="$regular">
            {count} items
          </Text>
        </XStack>
      </YStack>
    </Card>
  );
}
