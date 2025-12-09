import { useMemo } from "react";

import type { CategoryOption } from "@/src/shared/components/CategoryDropdown";
import { PhotoCategory } from "@/src/shared/types/categories";
import { useSmartCleanerStore } from "@/src/stores/useSmartCleanerStore";

export function useCategoryDropdown() {
  const getCount = useSmartCleanerStore((state) => state.getCount);

  const screenshotsCount = getCount(PhotoCategory.SCREENSHOTS);
  const selfiesCount = getCount(PhotoCategory.SELFIES);
  const similarPhotosCount = getCount(PhotoCategory.SIMILAR_PHOTOS);
  const livePhotosCount = getCount(PhotoCategory.LIVE_PHOTOS);
  const longVideosCount = getCount(PhotoCategory.LONG_VIDEOS);

  const categories = useMemo<CategoryOption[]>(
    () => [
      {
        id: PhotoCategory.SIMILAR_PHOTOS,
        label: "Similar photos",
        count: similarPhotosCount ?? 0,
      },
      {
        id: PhotoCategory.SCREENSHOTS,
        label: "Screenshots",
        count: screenshotsCount ?? 0,
      },
      {
        id: PhotoCategory.SELFIES,
        label: "Selfies",
        count: selfiesCount ?? 0,
      },
      {
        id: PhotoCategory.LIVE_PHOTOS,
        label: "Live Photos",
        count: livePhotosCount ?? 0,
      },
      {
        id: PhotoCategory.LONG_VIDEOS,
        label: "Long videos",
        count: longVideosCount ?? 0,
      },
    ],
    [
      screenshotsCount,
      selfiesCount,
      similarPhotosCount,
      livePhotosCount,
      longVideosCount,
    ]
  );

  return { categories };
}
