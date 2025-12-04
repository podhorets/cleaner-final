import type { Asset } from "expo-media-library";
import * as MediaLibrary from "expo-media-library";

import { Photo } from "@/src/types/models";

import { fetchAllAssets, requestMediaPermissions } from "./utils";

/**
 * Get similar photos grouped by creation time proximity
 * @param timeframeSeconds - Maximum time difference in seconds to group photos (default: 5)
 * @returns Array of photo groups, where each group contains similar photos
 */
export const getSimilarPhotos = async (
  timeframeSeconds = 5
): Promise<Photo[][]> => {
  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) return [];

  const assetsResult = await fetchAllAssets({
    mediaType: MediaLibrary.MediaType.photo,
    sortBy: MediaLibrary.SortBy.creationTime,
  } as Partial<MediaLibrary.AssetsOptions>);

  const all = assetsResult ?? [];
  if (all.length === 0) return [];

  // Sort ascending by creationTime (ms)
  const sorted = all.slice().sort((a, b) => a.creationTime - b.creationTime);

  const similarGroups: Asset[][] = [];
  const timeframeMs = timeframeSeconds * 1000;

  let group: Asset[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];

    if (group.length === 0) {
      group.push(current);
      continue;
    }

    const last = group[group.length - 1];
    const diff = current.creationTime - last.creationTime;

    if (diff <= timeframeMs) {
      group.push(current);
    } else {
      if (group.length > 1) similarGroups.push(group.slice());
      group = [current];
    }
  }

  if (group.length > 1) similarGroups.push(group);

  const similarGroupsPhotos = similarGroups.map((group: Asset[]) =>
    group.map((asset) => {
      return { uri: asset.uri, id: asset.id };
    })
  );

  return similarGroupsPhotos;
};

/**
 * Get count of all photos in similar photo groups
 */
export const getSimilarPhotosCount = async (): Promise<number> => {
  const groups = await getSimilarPhotos(5);
  return groups.reduce((total, group) => total + group.length, 0);
};
