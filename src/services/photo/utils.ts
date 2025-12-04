import type { Asset } from "expo-media-library";
import * as MediaLibrary from "expo-media-library";

/**
 * Request media library permissions
 * @returns {Promise<boolean>} True if granted, false otherwise
 */
export const requestMediaPermissions = async (): Promise<boolean> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === "granted";
};

/**
 * Fetch total count of all media assets
 */
export const fetchTotalCount = async (): Promise<number> => {
  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) return 0;

  const result = await MediaLibrary.getAssetsAsync({
    first: 1,
  });
  return result.totalCount;
};

/**
 * Fetch all assets from media library with pagination
 * @param opts - Media library options for filtering
 * @param pageSize - Number of assets per page (default: 500)
 */
export const fetchAllAssets = async (
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

/**
 * Simple concurrency limiter (p-limit style)
 * Limits the number of concurrent async operations
 * @param concurrency - Maximum number of concurrent operations (default: 4)
 */
export function pLimit(concurrency = 4) {
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
