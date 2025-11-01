import { Card, Text, XStack } from "tamagui";

type QuickLink = {
  id: string;
  label: string;
  count: string;
  onPress?: () => void;
};

export type QuickAccessRowProps = {
  links: QuickLink[];
};

export function QuickAccessRow({ links }: QuickAccessRowProps) {
  return (
    <XStack space="$3">
      {links.map((link) => (
        <Card key={link.id} flex={1} padding="$4" borderRadius="$6" bg="$color2" bordered>
          <Text fontSize="$4" fontWeight="700">
            {link.label}
          </Text>
          <Text color="$color11">{link.count}</Text>
        </Card>
      ))}
    </XStack>
  );
}