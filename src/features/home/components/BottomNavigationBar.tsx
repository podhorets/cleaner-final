import { XStack, YStack } from "tamagui";

import { AlertCircle, Grid2x2Plus, Rss, Shield } from "@tamagui/lucide-icons";

export function BottomNavigationBar() {
  return (
    <XStack
      bg="$menuBg"
      borderRadius="$9"
      p="$4"
      gap="$5"
      ai="center"
      jc="center"
      justify="center"
    >
      <Action icon={AlertCircle} />
      <Action icon={Rss} />
      <Action icon={Shield} />
      <Action icon={Grid2x2Plus} />
    </XStack>
  );
}

function Action({ icon: Icon }: { icon: any }) {
  return (
    <YStack
      height={58}
      width={58}
      bg="$text"
      br="$8"
      p="$3"
      items="center"
      justify="center"
    >
      <Icon size={24} color="$color" />
    </YStack>
  );
}
