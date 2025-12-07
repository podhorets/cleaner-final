import * as MediaLibrary from "expo-media-library";
import { MediaSubtype } from "expo-media-library";

import { Photo } from "@/src/types/models";

import { fetchAllAssets, requestMediaPermissions } from "./utils";

/**
 * Get long videos sorted by duration
 * @returns Array of video assets
 */
export const getLongVideos = async (): Promise<Photo[]> => {
  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) return [];

  const result = await MediaLibrary.getAssetsAsync({
    mediaType: MediaLibrary.MediaType.video,
    sortBy: MediaLibrary.SortBy.duration,
    first: 30,
  });

  return result.assets.map((asset) => ({
    uri: asset.uri,
    id: asset.id,
  }));
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
 * Get all live photos from media library
 * @returns Array of live photo photos
 */
export const getLivePhotos = async (): Promise<Photo[]> => {
  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) return [];

  const subtypes: MediaSubtype[] = ["livePhoto"];
  const assetsResult = await fetchAllAssets({
    mediaType: MediaLibrary.MediaType.photo,
    mediaSubtypes: subtypes,
    sortBy: MediaLibrary.SortBy.creationTime,
  } as Partial<MediaLibrary.AssetsOptions>);

  return assetsResult.map((asset) => ({ uri: asset.uri, id: asset.id }));
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
