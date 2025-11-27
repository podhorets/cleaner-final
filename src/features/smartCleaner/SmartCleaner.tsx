import { useEffect, useRef, useState } from "react";
import { Animated, Easing, LayoutChangeEvent } from "react-native";

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
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, ScrollView, Stack, Text, XStack, YStack } from "tamagui";

import { baseColors } from "@/src/theme/base";

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

const PROGRESS_SEGMENTS: readonly ProgressSegment[] = [
  {
    type: "similar",
    label: "Similar Photos",
    colorToken: "$cyan",
    colorValue: baseColors.cyan,
    value: 30,
  },
  {
    type: "screenshots",
    label: "Screenshots",
    colorToken: "$redPrimary",
    colorValue: baseColors.redPrimary,
    value: 28,
  },
  {
    type: "blurry",
    label: "Blurry photos",
    colorToken: "$blueTertiary",
    colorValue: baseColors.blueTertiary,
    value: 12,
  },
  {
    type: "selfie",
    label: "Selfie",
    colorToken: "$purple",
    colorValue: baseColors.purple,
    value: 10,
  },
  {
    type: "contacts",
    label: "Contacts",
    colorToken: "$orange",
    colorValue: baseColors.orange,
    value: 4,
  },
] as const;

export function SmartCleaner() {
  const router = useRouter();
  const [barWidth, setBarWidth] = useState(0);
  const totalPercent = PROGRESS_SEGMENTS.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const remainderPercent = Math.max(0, 100 - totalPercent);
  const hasRemainder = remainderPercent > 0;
  const progressValues = useRef(
    PROGRESS_SEGMENTS.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    if (!barWidth) {
      return;
    }

    progressValues.current.forEach((value) => {
      value.setValue(0);
    });

    const animations = PROGRESS_SEGMENTS.map((item, index) =>
      Animated.timing(progressValues.current[index], {
        toValue: Math.min(Math.max(item.value, 0), 100) / 100,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      })
    );

    Animated.stagger(120, animations).start();
  }, [barWidth]);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
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
                  <Stack
                    height={21}
                    br="$10"
                    bg="#76787E"
                    overflow="hidden"
                    onLayout={(event: LayoutChangeEvent) => {
                      const width = event.nativeEvent.layout.width;
                      if (width !== barWidth) {
                        setBarWidth(width);
                      }
                    }}
                  >
                    <XStack height="100%">
                      {PROGRESS_SEGMENTS.map((item, index) => {
                        const isFirst = index === 0;
                        const isLastColored =
                          index === PROGRESS_SEGMENTS.length - 1 &&
                          !hasRemainder;
                        const segmentWidth = Animated.multiply(
                          progressValues.current[index],
                          barWidth
                        );

                        return (
                          <Animated.View
                            key={item.type}
                            style={[
                              {
                                width: segmentWidth,
                                height: "100%",
                                backgroundColor: item.colorValue,
                                flexShrink: 0,
                              },
                              isFirst && {
                                borderTopLeftRadius: 20,
                                borderBottomLeftRadius: 20,
                              },
                              isLastColored && {
                                borderTopRightRadius: 20,
                                borderBottomRightRadius: 20,
                              },
                            ]}
                          />
                        );
                      })}
                      {hasRemainder && barWidth > 0 && (
                        <Stack
                          key="remainder"
                          height="100%"
                          bg="#76787E"
                          flexShrink={0}
                          style={{
                            width: (remainderPercent / 100) * barWidth,
                            borderTopRightRadius: 20,
                            borderBottomRightRadius: 20,
                          }}
                        />
                      )}
                    </XStack>
                  </Stack>

                  {/* Legend */}
                  <YStack gap="$2">
                    <XStack gap="$4" items="center" justify="space-between">
                      <XStack gap="$2" items="center">
                        <Stack width={8} height={8} br={9999} bg="$cyan" />
                        <Text fs={12} fw="$regular" color="$white">
                          Similar Photos
                        </Text>
                      </XStack>
                      <Stack width={53} />
                    </XStack>
                    <XStack gap="$4" items="center">
                      <XStack gap="$2" items="center">
                        <Stack width={8} height={8} br={9999} bg="$purple" />
                        <Text fs={12} fw="$regular" color="$white">
                          Selfie
                        </Text>
                      </XStack>
                      <XStack gap="$2" items="center">
                        <Stack width={8} height={8} br={9999} bg="$orange" />
                        <Text fs={12} fw="$regular" color="$white">
                          Contacts
                        </Text>
                      </XStack>
                    </XStack>
                    <XStack gap="$4" items="center" position="relative">
                      <XStack
                        gap="$2"
                        items="center"
                        position="absolute"
                        left={102}
                      >
                        <Stack
                          width={8}
                          height={8}
                          br={9999}
                          bg="$redPrimary"
                        />
                        <Text fs={12} fw="$regular" color="$white">
                          Screenshots
                        </Text>
                      </XStack>
                      <XStack
                        gap="$2"
                        items="center"
                        position="absolute"
                        left={193}
                      >
                        <Stack
                          width={8}
                          height={8}
                          br={9999}
                          bg="$blueTertiary"
                        />
                        <Text fs={12} fw="$regular" color="$white">
                          Blurry photos
                        </Text>
                      </XStack>
                    </XStack>
                  </YStack>
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
    </SafeAreaView>
  );
}
