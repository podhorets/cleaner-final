import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

import { useRouter } from "expo-router";
import { Button, Card, Stack, Text, XStack, YStack } from "tamagui";

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
    color: "#82DAF8",
    value: 38,
  },
  {
    type: "screenshots",
    label: "Screenshots",
    color: "#F17777",
    value: 28,
  },
  {
    type: "blurry",
    label: "Blurry Photos",
    color: "#5270F7",
    value: 12,
  },
  {
    type: "selfie",
    label: "Selfie",
    color: "#6F3BCB",
    value: 10,
  },
  {
    type: "live",
    label: "Live Photos",
    color: "#F8A745",
    value: 12,
  },
] as const;

const AnimatedSegment = Animated.createAnimatedComponent(Stack);

export function SmartClean() {
  const router = useRouter();
  const progressValues = useRef(
    SMART_CLEAN_PROGRESS.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    const animations = SMART_CLEAN_PROGRESS.map((item, index) =>
      Animated.timing(progressValues.current[index], {
        toValue: item.value,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      })
    );

    Animated.sequence(animations).start();
  }, []);

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
        <YStack bg="#2D3146" br="$6" p="$3" gap="$3">
          <Stack h={20} br="$10" bg="#43485E" overflow="hidden">
            <XStack h="100%">
              {SMART_CLEAN_PROGRESS.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === SMART_CLEAN_PROGRESS.length - 1;

                return (
                  <AnimatedSegment
                    key={item.type}
                    style={[
                      { flex: progressValues.current[index], height: "100%" },
                      { backgroundColor: item.color },
                      isFirst && {
                        borderTopLeftRadius: 40,
                        borderBottomLeftRadius: 40,
                      },
                      isLast && {
                        borderTopRightRadius: 40,
                        borderBottomRightRadius: 40,
                      },
                    ]}
                  />
                );
              })}
            </XStack>
          </Stack>
          <XStack gap="$3" flexWrap="wrap">
            {SMART_CLEAN_PROGRESS.map((item) => (
              <XStack key={item.type} gap="$2" items="center">
                <Stack w={10} h={10} br={9999} bg={item.color} />
                <Text color="#ffffffb3" fs={14} fw="$regular">
                  {item.label}
                </Text>
              </XStack>
            ))}
          </XStack>
        </YStack>
        <Button
          onPress={() => {}}
          bg="$hsSmartCleanButtonBg"
          br="$10"
          size="$5"
        >
          <YStack
            gap="$1"
            items="center"
            onPress={() => router.push("/smart-clean")}
          >
            <Text fs={16} fw="$medium" o={0.6}>
              Use smart clean
            </Text>
            <Text fs={20} fw="$medium">
              START SMART CLEAN
            </Text>
          </YStack>
        </Button>
      </YStack>
    </Card>
  );
}
