import { useMemo } from "react";

import type { CategoryOption } from "@/src/shared/components/CategoryDropdown";
import { PhotoCategory } from "@/src/shared/types/categories";
import { usePhotoCountStore } from "@/src/stores/usePhotoCountStore";

export function useCategoryDropdown() {
  const photoCountStore = usePhotoCountStore();

  const screenshotsCount = photoCountStore[PhotoCategory.SCREENSHOTS];
  const selfiesCount = photoCountStore[PhotoCategory.SELFIES];
  const similarPhotosCount = photoCountStore[PhotoCategory.SIMILAR_PHOTOS];
  const livePhotosCount = photoCountStore[PhotoCategory.LIVE_PHOTOS];
  const longVideosCount = photoCountStore[PhotoCategory.LONG_VIDEOS];

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
