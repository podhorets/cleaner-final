import { useEffect, useRef, useState } from "react";
import { Animated, Easing, LayoutChangeEvent } from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Card, Stack, Text, XStack, YStack } from "tamagui";

import WarningShield from "@/assets/images/warning_shield.svg";

type SmartCleanConfig = {
  type: string;
  label: string;
  color: string;
  value: number;
};

const SMART_CLEAN_PROGRESS: readonly SmartCleanConfig[] = [
  {
    type: "similar",
    label: "Similar Photos",
    color: "#73E0F8",
    value: 30,
  },
  {
    type: "screenshots",
    label: "Screenshots",
    color: "#FF6767",
    value: 28,
  },
  {
    type: "blurry",
    label: "Blurry Photos",
    color: "#0385FF",
    value: 12,
  },
  {
    type: "selfie",
    label: "Selfie",
    color: "#6D398B",
    value: 10,
  },
  {
    type: "live",
    label: "Live Photos",
    color: "#F28E1C",
    value: 4,
  },
] as const;

export function SmartClean() {
  const router = useRouter();
  const [barWidth, setBarWidth] = useState(0);
  const totalPercent = SMART_CLEAN_PROGRESS.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const remainderPercent = Math.max(0, 100 - totalPercent);
  const hasRemainder = remainderPercent > 0;
  const progressValues = useRef(
    SMART_CLEAN_PROGRESS.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    if (!barWidth) {
      return;
    }

    progressValues.current.forEach((value) => {
      value.setValue(0);
    });

    const animations = SMART_CLEAN_PROGRESS.map((item, index) =>
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
    <Card p="$3.5" br="$6" bg="#4248654d">
      <YStack gap="$3.5">
        <YStack gap="$2">
          <Text color="#FFFFFF" fs={24} fw="$semibold">
            Smart Cleaner
          </Text>
          <Text color="#ffffff80" fs={14} fw="$regular">
            Cleaning has not perfored yet
          </Text>
        </YStack>
        <YStack bg="#f8f8f821" br="$6" p="$3" gap="$3.5">
          <Stack
            height={20}
            br="$10"
            bg="#43485E"
            overflow="hidden"
            onLayout={(event: LayoutChangeEvent) => {
              const width = event.nativeEvent.layout.width;
              if (width !== barWidth) {
                setBarWidth(width);
              }
            }}
          >
            <XStack height="100%">
              {SMART_CLEAN_PROGRESS.map((item, index) => {
                const isFirst = index === 0;
                const isLastColored =
                  index === SMART_CLEAN_PROGRESS.length - 1 && !hasRemainder;
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
                        backgroundColor: item.color,
                        flexShrink: 0,
                      },
                      isFirst && {
                        borderTopLeftRadius: 40,
                        borderBottomLeftRadius: 40,
                      },
                      isLastColored && {
                        borderTopRightRadius: 40,
                        borderBottomRightRadius: 40,
                      },
                    ]}
                  />
                );
              })}
              {hasRemainder && barWidth > 0 && (
                <Stack
                  key="smart-clean-remainder"
                  height="100%"
                  bg="#43485E"
                  flexShrink={0}
                  style={{
                    width: (remainderPercent / 100) * barWidth,
                    borderTopRightRadius: 40,
                    borderBottomRightRadius: 40,
                  }}
                />
              )}
            </XStack>
          </Stack>
          <XStack gap="$3" flexWrap="wrap" justify="center">
            {SMART_CLEAN_PROGRESS.map((item) => (
              <XStack key={item.type} gap="$2" items="center">
                <Stack width={8} height={8} br={9999} bg={item.color} />
                <Text color="#FFFFFF" fs={12} fw="$regular">
                  {item.label}
                </Text>
              </XStack>
            ))}
          </XStack>
        </YStack>
        <YStack
          bg="#f8f8f821"
          br="$6"
          p="$1"
          gap="$2.5"
          items="center"
          position="relative"
        >
          <Stack
            position="absolute"
            top={0}
            right={0}
            width={35}
            height={25}
            bg="#FF6767"
            items="center"
            justify="center"
            style={{
              borderTopRightRadius: 18,
              borderBottomLeftRadius: 18,
            }}
          >
            <Image
              source={WarningShield}
              style={{ width: 16, height: 16 }}
              contentFit="contain"
            />
          </Stack>
          <Text color="#FF6767" fs={15} fw="$medium">
            Need cleaning
          </Text>
          <Text color="#FFFFFF" fs={20} fw="$regular">
            238,2 GB of 256 GB
          </Text>
        </YStack>
        <Stack
          onPress={() => router.push("/smart-clean")}
          bg="#FF6767"
          br="$6"
          py="$4"
          items="center"
        >
          <Text color="#FFFFFF" fs={20} fw="$medium">
            START SMART CLEAN
          </Text>
        </Stack>
      </YStack>
    </Card>
  );
}
