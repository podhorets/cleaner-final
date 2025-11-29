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

export const getScreenshots = async (): Promise<string[]> => {
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
  return assetsResult.map((x) => x.uri);
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
