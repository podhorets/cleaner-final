import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";

import type { CategoryOption } from "@/src/shared/components/CategoryDropdown";
import { PhotoCategory } from "@/src/shared/types/categories";
import { usePhotoCountStore } from "@/src/stores/usePhotoCountStore";

const CATEGORY_ROUTES: Record<PhotoCategory | string, string> = {
  [PhotoCategory.SIMILAR_PHOTOS]: "/similar-photos",
  [PhotoCategory.SCREENSHOTS]: "/screenshots",
  [PhotoCategory.BLURRY_PHOTOS]: "/selfie", // Maps to selfies route
  [PhotoCategory.SELFIES]: "/selfie",
  [PhotoCategory.LIVE_PHOTOS]: "/similar-photos", // TODO: Create dedicated route when implemented
  [PhotoCategory.LONG_VIDEOS]: "/long-videos",
};

export function useCategoryDropdown(currentCategoryId: string) {
  const router = useRouter();
  const photoCountStore = usePhotoCountStore();

  // Extract count values to avoid complex expressions in dependency array
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
        route: "/similar-photos",
      },
      {
        id: PhotoCategory.SCREENSHOTS,
        label: "Screenshots",
        count: screenshotsCount ?? 0,
        route: "/screenshots",
      },
      {
        id: PhotoCategory.SELFIES,
        label: "Selfies",
        count: selfiesCount ?? 0,
        route: "/selfie",
      },
      {
        id: PhotoCategory.LIVE_PHOTOS,
        label: "Live Photos",
        count: livePhotosCount ?? 0,
        route: "/similar-photos", // TODO: Create dedicated route when implemented
      },
      {
        id: PhotoCategory.LONG_VIDEOS,
        label: "Long videos",
        count: longVideosCount ?? 0,
        route: "/long-videos",
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

  const handleSelectCategory = useCallback(
    (categoryId: string) => {
      const route = CATEGORY_ROUTES[categoryId] || "/similar-photos";
      router.push(route as any);
    },
    [router]
  );

  return {
    categories,
    handleSelectCategory,
  };
}
