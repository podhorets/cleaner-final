import { create } from "zustand";

import { getLivePhotosCount, getLongVideosCount } from "@/src/services/photo/videos";
import { getScreenshotsCount } from "@/src/services/photo/screenshots";
import { getSelfiesCount } from "@/src/services/photo/selfies";
import { getSimilarPhotosCount } from "@/src/services/photo/similarPhotos";
import { requestMediaPermissions } from "@/src/services/photo/utils";

import { PhotoCategory } from "@/src/shared/types/categories";

interface PhotoCountState {
  [PhotoCategory.SCREENSHOTS]: number | null;
  [PhotoCategory.SELFIES]: number | null;
  [PhotoCategory.SIMILAR_PHOTOS]: number | null;
  [PhotoCategory.LIVE_PHOTOS]: number | null;
  [PhotoCategory.LONG_VIDEOS]: number | null;
  fetchAllCounts: () => Promise<void>;
  refetchAll: () => Promise<void>;
  refetchScreenshots: () => Promise<void>;
  refetchSelfies: () => Promise<void>;
  refetchSimilarPhotos: () => Promise<void>;
  refetchLivePhotos: () => Promise<void>;
  refetchLongVideos: () => Promise<void>;
}

export const usePhotoCountStore = create<PhotoCountState>((set, get) => ({
  [PhotoCategory.SCREENSHOTS]: null,
  [PhotoCategory.SELFIES]: null,
  [PhotoCategory.SIMILAR_PHOTOS]: null,
  [PhotoCategory.LIVE_PHOTOS]: null,
  [PhotoCategory.LONG_VIDEOS]: null,

  fetchAllCounts: async () => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) {
      return;
    }

    // Fetch all counts in parallel without blocking UI
    Promise.all([
      getScreenshotsCount().catch(() => 0),
      getSelfiesCount().catch(() => 0),
      getSimilarPhotosCount().catch(() => 0),
      getLivePhotosCount().catch(() => 0),
      getLongVideosCount().catch(() => 0),
    ]).then(([screenshots, selfies, similarPhotos, livePhotos, longVideos]) => {
      set({
        [PhotoCategory.SCREENSHOTS]: screenshots,
        [PhotoCategory.SELFIES]: selfies,
        [PhotoCategory.SIMILAR_PHOTOS]: similarPhotos,
        [PhotoCategory.LIVE_PHOTOS]: livePhotos,
        [PhotoCategory.LONG_VIDEOS]: longVideos,
      });
    });
  },

  refetchAll: async () => {
    await get().fetchAllCounts();
  },

  refetchScreenshots: async () => {
    const count = await getScreenshotsCount().catch(() => 0);
    set({ [PhotoCategory.SCREENSHOTS]: count });
  },

  refetchSelfies: async () => {
    const count = await getSelfiesCount().catch(() => 0);
    set({ [PhotoCategory.SELFIES]: count });
  },

  refetchSimilarPhotos: async () => {
    const count = await getSimilarPhotosCount().catch(() => 0);
    set({ [PhotoCategory.SIMILAR_PHOTOS]: count });
  },

  refetchLivePhotos: async () => {
    const count = await getLivePhotosCount().catch(() => 0);
    set({ [PhotoCategory.LIVE_PHOTOS]: count });
  },

  refetchLongVideos: async () => {
    const count = await getLongVideosCount().catch(() => 0);
    set({ [PhotoCategory.LONG_VIDEOS]: count });
  },
}));

