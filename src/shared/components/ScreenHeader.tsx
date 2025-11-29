import ArrowLeft from "@/assets/images/arrow_left.svg";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Button, Stack, Text, XStack } from "tamagui";

type ScreenHeaderProps = {
  title: string;
  rightAction?: {
    label: string;
    onPress: () => void;
  };
};

export function ScreenHeader({ title, rightAction }: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <XStack px="$4" py="$3" items="center" justify="space-between" gap="$4">
      {/* Left: Back Button */}
      <Button
        unstyled
        onPress={() => router.back()}
        width={24}
        height={24}
        items="center"
        justify="center"
      >
        <Image
          source={ArrowLeft}
          style={{ width: 24, height: 24 }}
          contentFit="contain"
        />
      </Button>

      {/* Middle: Title */}
      <Text fs={20} fw="$semibold" color="$white" flex={1} textAlign="center">
        {title}
      </Text>

      {/* Right: Action Button or Spacer */}
      {rightAction ? (
        <Button unstyled onPress={rightAction.onPress} px="$2">
          <Text fs={16} fw="$medium" color="$white">
            {rightAction.label}
          </Text>
        </Button>
      ) : (
        <Stack width={24} />
      )}
    </XStack>
  );
}
