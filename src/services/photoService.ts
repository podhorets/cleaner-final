import type { Asset } from "expo-media-library";
import { MediaSubtype } from "expo-media-library";

import { Photo } from "@/src/types/models";
import { File } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export const fetchTotalCount = async (): Promise<number> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") return 0;

  const result = await MediaLibrary.getAssetsAsync({
    first: 1,
  });
  return result.totalCount;
};

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

  // 4) If bytes found, accumulate and log
  if (bytes != null) {
    return bytes / (1024 * 1024);
  }

  return 0;
};

// simple concurrency limiter (p-limit style)
function pLimit(concurrency = 4) {
  const queue: {
    fn: () => Promise<any>;
    resolve: (v: any) => void;
    reject: (e: any) => void;
  }[] = [];
  let active = 0;
  const next = () => {
    if (active >= concurrency || queue.length === 0) return;
    const item = queue.shift()!;
    active++;
    item
      .fn()
      .then(item.resolve)
      .catch(item.reject)
      .finally(() => {
        active--;
        next();
      });
  };
  return (fn: () => Promise<any>) =>
    new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
}

const calculateFilesSize = async (assetsResult: Asset[]) => {
  // concurrency limiter: tune between 2-6 depending on test
  const limit = pLimit(4);

  let totalMb = 0;
  // process assets with limited concurrency, each safely guarded
  const tasks = assetsResult.map((asset) =>
    limit(async () => {
      try {
        // 1) Asset-level info (gives localUri when available)
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
        const uri = assetInfo?.localUri;
        if (!uri) {
          // no accessible uri (content URI or permission issue)
          console.warn("No local URI for asset", asset.id);
          return null;
        }

        let bytes: number | null = null;

        // 2) Preferred: use File class's info() if available (native metadata)

        try {
          const file = new File(uri);
          bytes = file.size;
        } catch (e) {
          // file API may throw for content:// or ph:// URIs — fallthrough to fallback
          console.warn("FS File.info() failed for", asset.id, e);
        }

        // 4) If bytes found, accumulate and log
        if (bytes != null) {
          const mb = bytes / (1024 * 1024);
          totalMb += mb;
          console.log("final size", mb);
        } else {
          // graceful fallback if we can't read size
          console.log("size unknown for asset", asset.id);
        }
        return null;
      } catch (err) {
        // very defensive: an error for one asset must not crash the whole loop
        console.warn("Error processing asset", asset.id, err);
        return null;
      }
    })
  );

  await Promise.all(tasks);
  console.log("TOTAL MB for screenshots:", totalMb.toFixed(3));
};

export const getScreenshots = async (): Promise<Photo[]> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") return [];

  const subtypes: MediaSubtype[] = ["screenshot"];

  const assetsResult = await fetchAllAssets({
    mediaType: MediaLibrary.MediaType.photo,
    mediaSubtypes: subtypes,
    sortBy: MediaLibrary.SortBy.creationTime,
  } as Partial<MediaLibrary.AssetsOptions>);
  // const { result, time } = await measure(() =>
  //   calculateFilesSize(assetsResult)
  // );
  // console.log("time ", time);
  return assetsResult.map((x) => ({ uri: x.uri, id: x.id }));
};

export const getLongVideos = async (): Promise<Asset[]> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") return [];
  const result = await MediaLibrary.getAssetsAsync({
    mediaType: MediaLibrary.MediaType.video,
    sortBy: MediaLibrary.SortBy.duration,
    first: 30,
  });

  return result.assets;
};

export const getSimilarPhotos = async (
  timeframeSeconds = 5
): Promise<Photo[][]> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") return [];

  const assetsResult = await fetchAllAssets({
    mediaType: MediaLibrary.MediaType.photo,
    sortBy: MediaLibrary.SortBy.creationTime,
  } as Partial<MediaLibrary.AssetsOptions>);
  const all = assetsResult ?? [];
  if (all.length === 0) return [];

  // sort ascending by creationTime (ms)
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
    const diff = current.creationTime - last.creationTime; // ms

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
 * Get photos from the "Selfies" smart album
 * @returns {Promise<Photo[]>} List of selfie photos
 */
export const getSelfies = async (): Promise<Photo[]> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") return [];

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
 * Get blurry photos using EXIF metadata heuristics
 * Scans the most recent 50 photos for performance reasons.
 * Criteria: Shutter speed > 1/30s OR ISO > 1000
 * @returns {Promise<Photo[]>} List of potentially blurry photos
 */
export const getBlurryPhotos = async (): Promise<Photo[]> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") return [];

  // Limit to most recent 50 photos for performance (getAssetInfoAsync is slow)
  const result = await MediaLibrary.getAssetsAsync({
    mediaType: MediaLibrary.MediaType.photo,
    sortBy: MediaLibrary.SortBy.creationTime,
    first: 1000,
  });

  const assets = result.assets;
  const blurryPhotos: Photo[] = [];

  // Use concurrency limit for fetching asset info
  const limit = pLimit(5);

  await Promise.all(
    assets.map((asset) =>
      limit(async () => {
        try {
          const info = await MediaLibrary.getAssetInfoAsync(asset.id);
          const exif = info.exif as any; // Cast to any to access dynamic EXIF properties

          if (exif) {
            // Skip screenshots - they don't have camera EXIF data
            const userComment = exif["{Exif}"]?.UserComment || exif.UserComment;

            // Only analyze photos with actual camera metadata
            const exposureTime =
              exif.ExposureTime || exif["{Exif}"]?.ExposureTime;
            const isoRaw =
              exif.ISOSpeedRatings || exif["{Exif}"]?.ISOSpeedRatings;
            const iso = Array.isArray(isoRaw) ? isoRaw[0] : isoRaw;

            // Skip if no camera metadata exists
            if (exposureTime === undefined && iso === undefined) {
              return; // Not a camera photo
            }

            // Heuristics for blurriness:
            // 1. Slow shutter speed (ExposureTime): > 1/30s (approx 0.034s)
            // 2. High ISO (ISOSpeedRatings): > 1000 (often noisy/grainy)
            const isSlowShutter =
              typeof exposureTime === "number" && exposureTime > 0.034;
            const isHighISO = typeof iso === "number" && iso > 1000;

            if (isSlowShutter || isHighISO) {
              blurryPhotos.push({ uri: asset.uri, id: asset.id });
            }
          }
        } catch (error) {
          console.warn(`Failed to get EXIF for asset ${asset.id}`, error);
        }
      })
    )
  );

  return blurryPhotos;
};

const fetchAllAssets = async (
  opts: Partial<MediaLibrary.AssetsOptions> = {},
  pageSize = 500
): Promise<Asset[]> => {
  const all: MediaLibrary.Asset[] = [];
  let after: string | undefined = undefined;
  while (true) {
    const page = await MediaLibrary.getAssetsAsync({
      ...opts,
      first: pageSize,
      after,
    });
    all.push(...page.assets);
    if (!page.hasNextPage) break;
    after = page.endCursor;
  }
  return all;
};
