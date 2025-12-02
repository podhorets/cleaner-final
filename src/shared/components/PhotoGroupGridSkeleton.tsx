import { YStack } from "tamagui";

import { PhotoGroupSkeleton } from "@/src/shared/components/PhotoGroupSkeleton";

const GROUP_GAP = 15;
const SKELETON_GROUPS = 3; // Show 3 groups of skeletons

export function PhotoGroupGridSkeleton() {
  return (
    <YStack
      px={16}
      pt={16}
      pb={100}
      gap={GROUP_GAP}
    >
      {Array.from({ length: SKELETON_GROUPS }).map((_, groupIndex) => (
        <PhotoGroupSkeleton key={`skeleton-group-${groupIndex}`} groupIndex={groupIndex} />
      ))}
    </YStack>
  );
}

