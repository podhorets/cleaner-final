import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Text, YStack } from "tamagui";

import { PhotoSkeletonRow } from "@/src/shared/components/PhotoSkeleton";

const PHOTO_SIZE = 113;
const PHOTO_GAP = 3;
const GROUP_GAP = 15;
const COLUMNS = 3;
const SKELETON_ROWS_PER_GROUP = 2; // Show 2 rows per group (6 photos)

type PhotoGroupSkeletonProps = {
  groupIndex?: number;
};

function SkeletonCountLabel({ delay = 0 }: { delay?: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 400,
          easing: Easing.inOut(Easing.bounce),
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 400,
          easing: Easing.inOut(Easing.bounce),
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
        opacity,
      }}
    >
      <Text fs={15} fw="$medium" color="$blueTertiary">
        {SKELETON_ROWS_PER_GROUP * COLUMNS} items
      </Text>
    </Animated.View>
  );
}

export function PhotoGroupSkeleton({
  groupIndex = 0,
}: PhotoGroupSkeletonProps) {
  const baseDelay = groupIndex * 200;

  return (
    <YStack gap={3} items="center">
      {/* Count Label Skeleton */}
      <SkeletonCountLabel delay={baseDelay} />

      {/* Photo Grid Skeleton */}
      <YStack gap={3}>
        {Array.from({ length: SKELETON_ROWS_PER_GROUP }).map((_, rowIndex) => (
          <PhotoSkeletonRow
            key={`skeleton-group-${groupIndex}-row-${rowIndex}`}
            rowIndex={groupIndex * SKELETON_ROWS_PER_GROUP + rowIndex}
          />
        ))}
      </YStack>
    </YStack>
  );
}
