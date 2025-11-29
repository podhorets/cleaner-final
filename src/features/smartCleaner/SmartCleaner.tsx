import {
  ArrowLeft,
  Check,
  ChevronUp,
  Image,
  Users,
  Video,
  Zap,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Button, Card, ScrollView, Stack, Text, XStack, YStack } from "tamagui";

import { SmartCleanProgressBar } from "@/src/shared/components/SmartCleanProgressBar";

type CleanItem = {
  id: string;
  label: string;
  count: number;
  size: string;
  icon: any;
};

type ProgressSegment = {
  type: string;
  label: string;
  colorToken: string;
  colorValue: string;
  value: number;
};

const CLEAN_ITEMS: readonly CleanItem[] = [
  {
    id: "similar-photos",
    label: "Similar photos",
    count: 15,
    size: "12.00Mb",
    icon: Image,
  },
  {
    id: "screenshots",
    label: "Screenshots",
    count: 124,
    size: "12.00Mb",
    icon: Video,
  },
  {
    id: "blurry-photos",
    label: "Blurry photos",
    count: 15,
    size: "12.00Mb",
    icon: Zap,
  },
  {
    id: "selfie",
    label: "Selfie",
    count: 34,
    size: "12.00Mb",
    icon: Users,
  },
  {
    id: "duplicate-contacts",
    label: "Duplicate contacts",
    count: 62,
    size: "12.00Mb",
    icon: Users,
  },
] as const;

export function SmartCleaner() {
  const router = useRouter();

  return (
    <ScrollView>
      <YStack flex={1} bg="$darkBgAlt">
        {/* Navigation Bar */}
        <XStack px="$4" py="$3" items="center" justify="space-between" gap="$4">
          <Button
            unstyled
            onPress={() => router.back()}
            icon={ArrowLeft}
            size="$4"
            color="$white"
          />
          <Text fs={20} fw="$semibold" color="$white">
            Smart Cleaner
          </Text>
          <Stack width={24} />
        </XStack>

        <ScrollView flex={1}>
          <YStack px="$4" py="$3" gap="$4">
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
                  p="$2"
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
                  p="$3.5"
                  o={item.id === "similar-photos" ? 0.5 : 1}
                >
                  <XStack items="center" justify="space-between">
                    <XStack gap="$3" items="center" flex={1}>
                      {/* Icon */}
                      <Stack
                        bg="$whiteAlpha13"
                        br="$6"
                        width={43}
                        height={43}
                        items="center"
                        justify="center"
                      >
                        <item.icon size={21} color="$white" />
                      </Stack>

                      {/* Label and Size */}
                      <YStack gap="$1" flex={1}>
                        <XStack gap="$1" items="flex-end">
                          <Text fs={16} fw="$regular" color="$white">
                            {item.label}
                          </Text>
                          <ChevronUp size={18} color="$white" />
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
                      <Stack
                        bg="$blueTertiary"
                        borderWidth={2}
                        borderColor="$blueTertiary"
                        br="$2"
                        width={24}
                        height={24}
                        items="center"
                        justify="center"
                      >
                        <Check size={12} color="$white" />
                      </Stack>
                    </XStack>
                  </XStack>
                </Card>
              ))}
            </YStack>

            {/* Bottom Button */}
            <Button
              bg="$blueTertiary"
              br="$10"
              h={55}
              py="$5"
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
      </YStack>
    </ScrollView>
  );
}
