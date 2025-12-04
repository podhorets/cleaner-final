import * as MediaLibrary from "expo-media-library";
import { MediaSubtype } from "expo-media-library";

import { Photo } from "@/src/types/models";

import { fetchAllAssets, requestMediaPermissions } from "./utils";

/**
 * Get all screenshot photos from media library
 * @returns Array of screenshot photos
 */
export const getScreenshots = async (): Promise<Photo[]> => {
  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) return [];

  const subtypes: MediaSubtype[] = ["screenshot"];

  const assetsResult = await fetchAllAssets({
    mediaType: MediaLibrary.MediaType.photo,
    mediaSubtypes: subtypes,
    sortBy: MediaLibrary.SortBy.creationTime,
  } as Partial<MediaLibrary.AssetsOptions>);

  return assetsResult.map((x) => ({ uri: x.uri, id: x.id }));
};

/**
 * Get count of all screenshots
 */
export const getScreenshotsCount = async (): Promise<number> => {
  const screenshots = await getScreenshots();
  return screenshots.length;
};
