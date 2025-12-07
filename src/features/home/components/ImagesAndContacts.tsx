import ArrowRight from "@/assets/images/arrow_right.svg";
import GalleryCircle from "@/assets/images/gallery_circle.svg";
import UserCircle from "@/assets/images/user_circle.svg";
import { Image, ImageSource } from "expo-image";
import { router } from "expo-router";
import { Text, XStack, YStack } from "tamagui";

type QuickLink = {
  id: string;
  label: string;
  count: string;
  icon: ImageSource;
  onPress?: () => void;
};

export function ImagesAndContacts() {
  const links = [
    {
      id: "contacts",
      label: "Contact Cleaner",
      count: "13",
      icon: UserCircle,
      onPress: () => {},
    },
    {
      id: "gallery",
      label: "Gallery Cleaner",
      count: "11 842",
      icon: GalleryCircle,
      onPress: () => router.push("/classic-cleaner"),
    },
  ] as QuickLink[];

  return (
    <XStack gap="$3.5">
      {links.map((item) => (
        <QuickLinkCard key={item.id} {...item} />
      ))}
    </XStack>
  );
}

function QuickLinkCard({ label, count, icon, onPress }: QuickLink) {
  return (
    <YStack
      flex={1}
      p="$3.5"
      gap="$3.5"
      br="$6"
      bg="$darkBlueAlpha30"
      onPress={onPress}
    >
      <XStack alignItems="center" justify="space-between" pr="$3.5">
        <Text color="$white" fs={22} fw="$semibold">
          {label}
        </Text>
        <Image
          source={ArrowRight}
          style={{ width: 18, height: 18 }}
          contentFit="contain"
        />
      </XStack>

      <XStack alignItems="center" justify="space-between">
        <Text color="$gray3" fs={12} fw="$regular">
          Total files
        </Text>
        <XStack
          alignSelf="flex-start"
          p="$2"
          gap="$1.5"
          bg="$blueTertiary"
          br="$6"
          ai="center"
          o={0.8}
        >
          <Text color="$white" fs={14} fw="$medium">
            {count}
          </Text>
          <Image
            source={icon}
            style={{ width: 18, height: 18 }}
            contentFit="contain"
          />
        </XStack>
      </XStack>
    </YStack>
  );
}
