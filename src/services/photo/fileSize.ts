import { File } from "expo-file-system";
import type { Asset } from "expo-media-library";
import * as MediaLibrary from "expo-media-library";

import { pLimit } from "./utils";

/**
 * Get the size of a single photo in MB
 * @param id - Photo asset ID
 * @returns Size in MB, or 0 if unavailable
 */
export const getPhotoSize = async (id: string): Promise<number> => {
  const assetInfo = await MediaLibrary.getAssetInfoAsync(id);
  const uri = assetInfo?.localUri;
  if (!uri) {
    return 0;
  }

  let bytes: number | null = null;

  try {
    const file = new File(uri);
    bytes = file.size;
  } catch (e) {
    return 0;
  }

  if (bytes != null) {
    return bytes / (1024 * 1024);
  }

  return 0;
};

/**
 * Calculate total size of multiple assets
 * @param assetsResult - Array of assets to calculate size for
 * @returns Total size in MB
 */
export const calculateFilesSize = async (assetsResult: Asset[]): Promise<number> => {
  const limit = pLimit(4);
  let totalMb = 0;

  const tasks = assetsResult.map((asset) =>
    limit(async () => {
      try {
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
        const uri = assetInfo?.localUri;
        if (!uri) {
          console.warn("No local URI for asset", asset.id);
          return null;
        }

        let bytes: number | null = null;

        try {
          const file = new File(uri);
          bytes = file.size;
        } catch (e) {
          console.warn("FS File.info() failed for", asset.id, e);
        }

        if (bytes != null) {
          const mb = bytes / (1024 * 1024);
          totalMb += mb;
          console.log("final size", mb);
        } else {
          console.log("size unknown for asset", asset.id);
        }
        return null;
      } catch (err) {
        console.warn("Error processing asset", asset.id, err);
        return null;
      }
    })
  );

  await Promise.all(tasks);
  console.log("TOTAL MB for screenshots:", totalMb.toFixed(3));
  
  return totalMb;
};
