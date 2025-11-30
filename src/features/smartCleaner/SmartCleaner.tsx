import ArrowRight from "@/assets/images/arrow_right.svg";
import BlurryPhotos from "@/assets/images/blurry_photos.svg";
import Checked from "@/assets/images/checked_checkbox.svg";
import DuplicateContacts from "@/assets/images/duplicate_contacts.svg";
import Screenshots from "@/assets/images/screenshots.svg";
import Selfie from "@/assets/images/selfie.svg";
import SimilarPhotos from "@/assets/images/similar_photos.svg";
import Unchecked from "@/assets/images/unchecked_checkbox.svg";
import { Image, ImageSource } from "expo-image";
import { Button, Card, ScrollView, Stack, Text, XStack, YStack } from "tamagui";

import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { SmartCleanProgressBar } from "@/src/shared/components/SmartCleanProgressBar";
import { router } from "expo-router";

type CleanItem = {
  id: string;
  label: string;
  count: number;
  size: string;
  icon: ImageSource;
  checked: boolean;
  route: string;
};

const CLEAN_ITEMS: readonly CleanItem[] = [
  {
    id: "similar-photos",
    label: "Similar photos",
    count: 15,
    size: "12.00Mb",
    icon: SimilarPhotos,
    checked: true,
    route: "/similar-photos",
  },
  {
    id: "screenshots",
    label: "Screenshots",
    count: 124,
    size: "12.00Mb",
    icon: Screenshots,
    checked: false,
    route: "/screenshots",
  },
  {
    id: "blurry-photos",
    label: "Blurry photos",
    count: 15,
    size: "12.00Mb",
    icon: BlurryPhotos,
    checked: true,
    route: "/blurry-photos",
  },
  {
    id: "selfie",
    label: "Selfie",
    count: 34,
    size: "12.00Mb",
    icon: Selfie,
    checked: false,
    route: "/selfie",
  },
  {
    id: "duplicate-contacts",
    label: "Duplicate contacts",
    count: 62,
    size: "12.00Mb",
    icon: DuplicateContacts,
    checked: false,
    route: "/contacts",
  },
  {
    id: "internet-speed",
    label: "Internet speed",
    count: 0,
    size: "0Mb",
    icon: BlurryPhotos,
    checked: false,
    route: "/internet-speed",
  },
] as const;

export function SmartCleaner() {
  return (
    <ScrollView>
      {/* Header */}
      <ScreenHeader title="Smart Cleaner" />
      <YStack gap="$4" px="$3.5">
        {/* Smart Clean Card */}
        <Card bg="$darkBlueAlpha30" br="$6" p="$3.5">
          <YStack gap="$4">
            {/* Last Clean Date */}
            <YStack bg="$whiteAlpha13" br="$6" p="$3" gap="$2.5">
              <Text fs={14} fw="$regular" color="$white">
                Last clean: 16 apr
              </Text>

              {/* Progress Bar */}
              <SmartCleanProgressBar />
            </YStack>

            {/* Storage Info */}
            <XStack
              bg="$whiteAlpha13"
              br="$6"
              px="$3"
              py="$2"
              items="center"
              justify="space-between"
            >
              <Text
                fs={14}
                fw="$regular"
                color="$white"
                textTransform="uppercase"
              >
                storage load on
              </Text>
              <XStack gap="$1" items="flex-end">
                <Text fs={20} fw="$regular" color="$redPrimary">
                  238,2
                </Text>
                <Text fs={20} fw="$regular" color="$white">
                  GB
                </Text>
              </XStack>
            </XStack>
          </YStack>
        </Card>

        {/* Clean Items List */}
        <YStack gap="$2">
          {CLEAN_ITEMS.map((item) => (
            <Card
              key={item.id}
              bg="$darkBlueAlpha30"
              br="$6"
              py="$2.5"
              px="$3.5"
              // o={item.id === "similar-photos" ? 0.5 : 1}
            >
              <XStack items="center" justify="space-between">
                <XStack
                  gap="$3"
                  items="center"
                  flex={1}
                  onPress={() => router.push(item.route)}
                >
                  {/* Icon */}
                  <Stack
                    bg="$whiteAlpha13"
                    br="$6"
                    width={43}
                    height={43}
                    items="center"
                    justify="center"
                  >
                    <Image
                      source={item.icon}
                      style={{ width: 21, height: 21 }}
                      contentFit="contain"
                    />
                  </Stack>

                  {/* Label and Size */}
                  <YStack gap="$1.5" flex={1}>
                    <XStack gap="$1.5" items="flex-end">
                      <Text fs={16} fw="$regular" color="$white">
                        {item.label}
                      </Text>
                      <Image
                        source={ArrowRight}
                        style={{ width: 18, height: 18 }}
                        contentFit="contain"
                      />
                    </XStack>
                    <Text fs={12} fw="$regular" color="$textSecondary">
                      {item.size}
                    </Text>
                  </YStack>
                </XStack>

                {/* Count and Checkbox */}
                <XStack gap="$3.5" items="center">
                  <Text fs={16} fw="$medium" color="$blueTertiary">
                    {item.count}
                  </Text>
                  <Image
                    source={item.checked ? Checked : Unchecked}
                    style={{ width: 24, height: 24 }}
                    contentFit="contain"
                  />
                </XStack>
              </XStack>
            </Card>
          ))}
        </YStack>

        {/* Bottom Button */}
        <Button
          bg="$blueTertiary"
          br="$9"
          height={55}
          onPress={() => {
            // Handle cleaning action
          }}
        >
          <Text fs={17} fw="$semibold" color="$white">
            Cleaning files
          </Text>
        </Button>
      </YStack>
    </ScrollView>
  );
}
