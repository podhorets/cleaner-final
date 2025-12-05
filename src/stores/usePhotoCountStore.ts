import { create } from "zustand";

import { getLivePhotosCount, getLongVideosCount } from "@/src/services/photo/videos";
import { getScreenshotsCount } from "@/src/services/photo/screenshots";
import { getSelfiesCount } from "@/src/services/photo/selfies";
import { getSimilarPhotosCount } from "@/src/services/photo/similarPhotos";
import { requestMediaPermissions } from "@/src/services/photo/utils";

interface PhotoCountState {
  screenshots: number | null;
  selfies: number | null;
  similarPhotos: number | null;
  livePhotos: number | null;
  longVideos: number | null;
  fetchAllCounts: () => Promise<void>;
  refetchAll: () => Promise<void>;
  refetchScreenshots: () => Promise<void>;
  refetchSelfies: () => Promise<void>;
  refetchSimilarPhotos: () => Promise<void>;
  refetchLivePhotos: () => Promise<void>;
  refetchLongVideos: () => Promise<void>;
}

export const usePhotoCountStore = create<PhotoCountState>((set, get) => ({
  screenshots: null,
  selfies: null,
  similarPhotos: null,
  livePhotos: null,
  longVideos: null,

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
        screenshots,
        selfies,
        similarPhotos,
        livePhotos,
        longVideos,
      });
    });
  },

  refetchAll: async () => {
    await get().fetchAllCounts();
  },

  refetchScreenshots: async () => {
    const count = await getScreenshotsCount().catch(() => 0);
    set({ screenshots: count });
  },

  refetchSelfies: async () => {
    const count = await getSelfiesCount().catch(() => 0);
    set({ selfies: count });
  },

  refetchSimilarPhotos: async () => {
    const count = await getSimilarPhotosCount().catch(() => 0);
    set({ similarPhotos: count });
  },

  refetchLivePhotos: async () => {
    const count = await getLivePhotosCount().catch(() => 0);
    set({ livePhotos: count });
  },

  refetchLongVideos: async () => {
    const count = await getLongVideosCount().catch(() => 0);
    set({ longVideos: count });
  },
}));

