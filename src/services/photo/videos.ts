import type { Asset } from "expo-media-library";
import * as MediaLibrary from "expo-media-library";
import { MediaSubtype } from "expo-media-library";

import { fetchAllAssets, requestMediaPermissions } from "./utils";

/**
 * Get long videos sorted by duration
 * @returns Array of video assets
 */
export const getLongVideos = async (): Promise<Asset[]> => {
  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) return [];

  const result = await MediaLibrary.getAssetsAsync({
    mediaType: MediaLibrary.MediaType.video,
    sortBy: MediaLibrary.SortBy.duration,
    first: 30,
  });

  return result.assets;
};

/**
 * Get count of all videos
 */
export const getLongVideosCount = async (): Promise<number> => {
  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) return 0;

  const result = await MediaLibrary.getAssetsAsync({
    mediaType: MediaLibrary.MediaType.video,
    sortBy: MediaLibrary.SortBy.duration,
    first: 1,
  });
  return result.totalCount;
};

/**
 * Get count of all live photos
 */
export const getLivePhotosCount = async (): Promise<number> => {
  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) return 0;

  const subtypes: MediaSubtype[] = ["livePhoto"];
  const assetsResult = await fetchAllAssets({
    mediaType: MediaLibrary.MediaType.photo,
    mediaSubtypes: subtypes,
    sortBy: MediaLibrary.SortBy.creationTime,
  } as Partial<MediaLibrary.AssetsOptions>);
  
  return assetsResult.length;
};
