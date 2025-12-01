import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";

import {
  getLivePhotosCount,
  getLongVideosCount,
  getScreenshotsCount,
  getSelfiesCount,
  getSimilarPhotosCount,
} from "@/src/services/photoService";
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
  const [categories, setCategories] = useState<CategoryOption[]>([
    { id: "similar-photos", label: "Similar photos", count: 0, route: "/similar-photos" },
    { id: "screenshots", label: "Screenshots", count: 0, route: "/screenshots" },
    { id: "blurry-photos", label: "Blurry photos", count: 0, route: "/selfie" },
    { id: "selfies", label: "Selfies", count: 0, route: "/selfie" },
    { id: "live-photos", label: "Live Photos", count: 0, route: "/similar-photos" },
  ]);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [similarCount, screenshotsCount, selfiesCount, liveCount, longVideosCount] = await Promise.all([
          getSimilarPhotosCount().catch(() => 0),
          getScreenshotsCount().catch(() => 0),
          getSelfiesCount().catch(() => 0),
          getLivePhotosCount().catch(() => 0),
          getLongVideosCount().catch(() => 0),
        ]);

        setCategories([
          { id: "similar-photos", label: "Similar photos", count: similarCount, route: "/similar-photos" },
          { id: "screenshots", label: "Screenshots", count: screenshotsCount, route: "/screenshots" },
          { id: "blurry-photos", label: "Blurry photos", count: selfiesCount, route: "/selfie" },
          { id: "selfies", label: "Selfies", count: selfiesCount, route: "/selfie" },
          { id: "live-photos", label: "Live Photos", count: liveCount, route: "/similar-photos" },
          { id: "long-videos", label: "Long videos", count: longVideosCount, route: "/long-videos" },
        ]);
      } catch (error) {
        console.error("Failed to load category counts:", error);
      }
    };

    loadCounts();
  }, []);

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

