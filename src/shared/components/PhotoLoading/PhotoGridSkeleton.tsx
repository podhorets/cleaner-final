import { YStack } from "tamagui";

import { PhotoSkeletonRow } from "@/src/shared/components/PhotoLoading/PhotoSkeleton";

const SKELETON_ROWS = 6; // Show 6 rows of skeletons (18 placeholders total)

export function PhotoGridSkeleton() {
  const skeletonRows = Array.from({ length: SKELETON_ROWS }, (_, i) => i);

  return (
    <YStack px={16} pt={16} pb={100} gap={3}>
      {skeletonRows.map((rowIndex) => (
        <PhotoSkeletonRow
          key={`skeleton-row-${rowIndex}`}
          rowIndex={rowIndex}
        />
      ))}
    </YStack>
  );
}
