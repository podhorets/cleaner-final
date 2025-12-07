import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";

import { usePhotoCountStore } from "@/src/stores/usePhotoCountStore";
import type { CategoryOption } from "@/src/shared/components/CategoryDropdown";

const CATEGORY_ROUTES: Record<string, string> = {
  "similar-photos": "/similar-photos",
  screenshots: "/screenshots",
  "blurry-photos": "/selfie",
  selfies: "/selfie",
  "live-photos": "/similar-photos", // Default route, can be updated later
  "long-videos": "/long-videos",
};

export function useCategoryDropdown(currentCategoryId: string) {
  const router = useRouter();
  const {
    screenshots,
    selfies,
    similarPhotos,
    livePhotos,
    longVideos,
  } = usePhotoCountStore();

  const categories = useMemo<CategoryOption[]>(
    () => [
      {
        id: "similar-photos",
        label: "Similar photos",
        count: similarPhotos ?? 0,
        route: "/similar-photos",
      },
      {
        id: "screenshots",
        label: "Screenshots",
        count: screenshots ?? 0,
        route: "/screenshots",
      },
      {
        id: "blurry-photos",
        label: "Blurry photos",
        count: selfies ?? 0,
        route: "/selfie",
      },
      {
        id: "selfies",
        label: "Selfies",
        count: selfies ?? 0,
        route: "/selfie",
      },
      {
        id: "live-photos",
        label: "Live Photos",
        count: livePhotos ?? 0,
        route: "/similar-photos",
      },
      {
        id: "long-videos",
        label: "Long videos",
        count: longVideos ?? 0,
        route: "/long-videos",
      },
    ],
    [screenshots, selfies, similarPhotos, livePhotos, longVideos]
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
