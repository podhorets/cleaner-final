import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";

import type { CategoryOption } from "@/src/shared/components/CategoryDropdown";
import { PhotoCategory } from "@/src/shared/types/categories";
import { usePhotoCountStore } from "@/src/stores/usePhotoCountStore";

const CATEGORY_ROUTES: Record<PhotoCategory | string, string> = {
  [PhotoCategory.SIMILAR_PHOTOS]: "/similar-photos",
  [PhotoCategory.SCREENSHOTS]: "/screenshots",
  [PhotoCategory.BLURRY_PHOTOS]: "/selfie",
  [PhotoCategory.SELFIES]: "/selfie",
  [PhotoCategory.LIVE_PHOTOS]: "/similar-photos", // Default route, can be updated later
  [PhotoCategory.LONG_VIDEOS]: "/long-videos",
};

export function useCategoryDropdown(currentCategoryId: string) {
  const router = useRouter();
  const photoCountStore = usePhotoCountStore();

  const categories = useMemo<CategoryOption[]>(
    () => [
      {
        id: PhotoCategory.SIMILAR_PHOTOS,
        label: "Similar photos",
        count: photoCountStore[PhotoCategory.SIMILAR_PHOTOS] ?? 0,
        route: "/similar-photos",
      },
      {
        id: PhotoCategory.SCREENSHOTS,
        label: "Screenshots",
        count: photoCountStore[PhotoCategory.SCREENSHOTS] ?? 0,
        route: "/screenshots",
      },
      {
        id: PhotoCategory.BLURRY_PHOTOS,
        label: "Blurry photos",
        count: photoCountStore[PhotoCategory.SELFIES] ?? 0,
        route: "/selfie",
      },
      {
        id: PhotoCategory.SELFIES,
        label: "Selfies",
        count: photoCountStore[PhotoCategory.SELFIES] ?? 0,
        route: "/selfie",
      },
      {
        id: PhotoCategory.LIVE_PHOTOS,
        label: "Live Photos",
        count: photoCountStore[PhotoCategory.LIVE_PHOTOS] ?? 0,
        route: "/similar-photos",
      },
      {
        id: PhotoCategory.LONG_VIDEOS,
        label: "Long videos",
        count: photoCountStore[PhotoCategory.LONG_VIDEOS] ?? 0,
        route: "/long-videos",
      },
    ],
    [
      photoCountStore[PhotoCategory.SCREENSHOTS],
      photoCountStore[PhotoCategory.SELFIES],
      photoCountStore[PhotoCategory.SIMILAR_PHOTOS],
      photoCountStore[PhotoCategory.LIVE_PHOTOS],
      photoCountStore[PhotoCategory.LONG_VIDEOS],
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
