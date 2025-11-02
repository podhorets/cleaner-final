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
      backgroundColor="$text"
      borderRadius="$6"
      opacity={0.8}
      minW={useMinWidth ? "$11" : undefined}
    >
      {Icon && <Icon size={18} color="$background" />}
      <Text color="$background" fontSize={12} fontWeight="$medium">
        {value}
      </Text>
    </XStack>
  );
}
