import { Text, XStack } from "tamagui";

export function Badge({
  icon: Icon,
  value,
  useMinWidth = false,
}: {
  icon?: any;
  value: string;
  useMinWidth?: boolean;
}) {
  return (
    <XStack
      items="center"
      gap="$2"
      px="$3"
      py="$2"
      bg="$text"
      br="$6"
      o={0.8}
      minW={useMinWidth ? "$11" : undefined}
    >
      {Icon && <Icon size={18} color="$bg" />}
      <Text color="$bg" fs={12} fw="$medium">
        {value}
      </Text>
    </XStack>
  );
}
