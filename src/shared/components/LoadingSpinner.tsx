import { baseColors } from "@/src/theme/base";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Stack, YStack } from "tamagui";

type LoadingSpinnerProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fullScreen?: boolean;
};

export function LoadingSpinner({
  size = 50,
  color = baseColors.blueTertiary,
  strokeWidth = 4,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    spin.start();

    return () => {
      spin.stop();
    };
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const Container = fullScreen ? YStack : Stack;

  return (
    <Container
      flex={fullScreen ? 1 : undefined}
      items="center"
      justify="center"
      bg={fullScreen ? "$darkBgAlt" : undefined}
    >
      <Stack
        width={size}
        height={size}
        items="center"
        justify="center"
        position="relative"
      >
        {/* Background circle (subtle) */}
        <Stack
          position="absolute"
          width={size}
          height={size}
          borderRadius={size / 2}
          borderWidth={strokeWidth}
          borderColor={baseColors.whiteAlpha13}
          opacity={0.2}
        />
        {/* Animated spinner */}
        <Animated.View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: "transparent",
            borderTopColor: color,
            borderRightColor: color,
            borderTopWidth: strokeWidth,
            borderRightWidth: strokeWidth,
            transform: [{ rotate: spin }],
          }}
        />
      </Stack>
    </Container>
  );
}
