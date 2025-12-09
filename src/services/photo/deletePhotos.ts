import * as MediaLibrary from "expo-media-library";

import { requestMediaPermissions } from "./utils";

/**
 * Result of batch deletion with progress tracking
 */
export interface DeleteResult {
  success: number;
  failed: number;
}

/**
 * Delete photos from the device media library
 * @param photoIds - Array of photo IDs to delete
 * @returns Promise that resolves to true if deletion was successful, false otherwise
 */
export const deletePhotos = async (photoIds: string[]): Promise<boolean> => {
  // Handle empty array
  if (!photoIds || photoIds.length === 0) {
    return true; // No-op for empty arrays
  }

  // Check permissions
  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) {
    console.warn("Media library permission denied");
    return false;
  }

  try {
    await MediaLibrary.deleteAssetsAsync(photoIds);
    return true;
  } catch (error) {
    console.error("Failed to delete photos:", error);
    return false;
  }
};

/**
 * Delete photos with progress tracking and batch processing
 * Processes deletions in batches to provide progress updates
 * @param photoIds - Array of photo IDs to delete
 * @param onProgress - Optional callback for progress updates (deleted, total)
 * @param batchSize - Number of photos to delete per batch (default: 20)
 * @returns Promise that resolves to DeleteResult with success/failure counts
 */
export const deletePhotosWithProgress = async (
  photoIds: string[],
  onProgress?: (deleted: number, total: number) => void,
  batchSize = 20
): Promise<DeleteResult> => {
  const result: DeleteResult = {
    success: 0,
    failed: 0,
  };

  // Handle empty array
  if (!photoIds || photoIds.length === 0) {
    return result;
  }

  // Check permissions
  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) {
    console.warn("Media library permission denied");
    result.failed = photoIds.length;
    return result;
  }

  const total = photoIds.length;

  // Process in batches
  for (let i = 0; i < photoIds.length; i += batchSize) {
    const batch = photoIds.slice(i, i + batchSize);

    try {
      await MediaLibrary.deleteAssetsAsync(batch);
      result.success += batch.length;
    } catch (error) {
      console.error(`Failed to delete batch ${i / batchSize + 1}:`, error);
      result.failed += batch.length;
    }

    // Notify progress
    if (onProgress) {
      onProgress(result.success + result.failed, total);
    }
  }

  return result;
};
