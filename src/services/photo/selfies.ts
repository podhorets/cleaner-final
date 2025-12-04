import * as MediaLibrary from "expo-media-library";

import { Photo } from "@/src/types/models";

import { fetchAllAssets, requestMediaPermissions } from "./utils";

/**
 * Get photos from the "Selfies" smart album
 * @returns List of selfie photos
 */
export const getSelfies = async (): Promise<Photo[]> => {
  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) return [];

  // 1. Try to find the "Selfies" smart album
  const albums = await MediaLibrary.getAlbumsAsync({
    includeSmartAlbums: true,
  });

  const selfieAlbum = albums.find((album) => {
    // iOS: "Selfies", Android: "Selfie" or similar depending on OS version/manufacturer
    const title = album.title.toLowerCase();
    return title === "selfies" || title === "selfie";
  });

  if (!selfieAlbum) {
    console.log("No 'Selfies' album found.");
    return [];
  }

  // 2. Fetch assets from that album
  const assetsResult = await fetchAllAssets({
    album: selfieAlbum.id,
    mediaType: MediaLibrary.MediaType.photo,
    sortBy: MediaLibrary.SortBy.creationTime,
  } as Partial<MediaLibrary.AssetsOptions>);

  return assetsResult.map((asset) => ({
    uri: asset.uri,
    id: asset.id,
  }));
};

/**
 * Get count of all selfie photos
 */
export const getSelfiesCount = async (): Promise<number> => {
  const selfies = await getSelfies();
  return selfies.length;
};
