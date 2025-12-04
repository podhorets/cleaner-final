import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { XStack } from "tamagui";

const PHOTO_SIZE = 113;
const PHOTO_GAP = 3;
const COLUMNS = 3;

type PhotoSkeletonProps = {
  delay?: number;
};

function PhotoSkeleton({ delay = 0 }: PhotoSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 200,
          easing: Easing.inOut(Easing.ease),
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity, delay]);

  return (
    <Animated.View
      style={{
        width: PHOTO_SIZE,
        height: PHOTO_SIZE,
        borderRadius: 16,
        backgroundColor: "rgba(66,72,101,0.3)",
        opacity,
      }}
    />
  );
}

type PhotoSkeletonRowProps = {
  rowIndex?: number;
};

export function PhotoSkeletonRow({ rowIndex = 0 }: PhotoSkeletonRowProps) {
  return (
    <XStack gap={PHOTO_GAP}>
      {Array.from({ length: COLUMNS }).map((_, colIndex) => (
        <PhotoSkeleton
          key={`skeleton-${rowIndex}-${colIndex}`}
          delay={(rowIndex * COLUMNS + colIndex) * 100}
        />
      ))}
    </XStack>
  );
}
