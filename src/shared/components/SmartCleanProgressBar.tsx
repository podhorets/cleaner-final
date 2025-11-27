import { baseColors } from "@/src/theme/base";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, LayoutChangeEvent } from "react-native";
import { Stack, Text, XStack } from "tamagui";

export type SmartCleanConfig = {
  type: string;
  label: string;
  color: string;
  value: number;
};

export const SMART_CLEAN_PROGRESS: readonly SmartCleanConfig[] = [
  {
    type: "similar",
    label: "Similar Photos",
    color: baseColors.cyan,
    value: 30,
  },
  {
    type: "screenshots",
    label: "Screenshots",
    color: baseColors.redPrimary,
    value: 28,
  },
  {
    type: "blurry",
    label: "Blurry Photos",
    color: baseColors.blueTertiary,
    value: 12,
  },
  {
    type: "selfie",
    label: "Selfies",
    color: baseColors.purple,
    value: 10,
  },
  {
    type: "live",
    label: "Live Photos",
    color: baseColors.orange,
    value: 4,
  },
] as const;

export function SmartCleanProgressBar() {
  const borderRadius = 20;
  const items = SMART_CLEAN_PROGRESS;
  const [barWidth, setBarWidth] = useState(0);
  const totalPercent = items.reduce((sum, item) => sum + item.value, 0);
  const remainderPercent = Math.max(0, 100 - totalPercent);
  const hasRemainder = remainderPercent > 0;

  const progressValues = useRef(items.map(() => new Animated.Value(0)));

  useEffect(() => {
    if (!barWidth) {
      return;
    }

    progressValues.current.forEach((value) => {
      value.setValue(0);
    });

    const animations = items.map((item, index) =>
      Animated.timing(progressValues.current[index], {
        toValue: Math.min(Math.max(item.value, 0), 100) / 100,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      })
    );

    Animated.stagger(120, animations).start();
  }, [barWidth, items]);

  return (
    <Stack gap="$3.5">
      <Stack
        height={21}
        br={borderRadius}
        bg={"#76787E"}
        overflow="hidden"
        onLayout={(event: LayoutChangeEvent) => {
          const width = event.nativeEvent.layout.width;
          if (width !== barWidth) {
            setBarWidth(width);
          }
        }}
      >
        <XStack height="100%">
          {items.map((item, index) => {
            const isFirst = index === 0;
            const isLastColored = index === items.length - 1 && !hasRemainder;
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
                    borderTopLeftRadius: borderRadius,
                    borderBottomLeftRadius: borderRadius,
                  },
                  isLastColored && {
                    borderTopRightRadius: borderRadius,
                    borderBottomRightRadius: borderRadius,
                  },
                ]}
              />
            );
          })}
          {hasRemainder && barWidth > 0 && (
            <Stack
              key="smart-clean-remainder"
              height="100%"
              bg={"#76787E"}
              flexShrink={0}
              style={{
                width: (remainderPercent / 100) * barWidth,
                borderTopRightRadius: borderRadius,
                borderBottomRightRadius: borderRadius,
              }}
            />
          )}
        </XStack>
      </Stack>

      <XStack gap="$3" flexWrap="wrap" justify="center">
        {items.map((item) => (
          <XStack key={item.type} gap="$2" items="center">
            <Stack width={8} height={8} br={9999} bg={item.color} />
            <Text color="$white" fs={12} fw="$regular">
              {item.label}
            </Text>
          </XStack>
        ))}
      </XStack>
    </Stack>
  );
}
