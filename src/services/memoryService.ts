import * as FileSystem from "expo-file-system/legacy";

export interface StorageUsage {
  total: number; // Total storage capacity in bytes
  totalGB: number; // Total storage capacity in GB
  free: number; // Free storage available in bytes
  freeGB: number; // Free storage available in GB
  used: number; // Used storage in bytes
  usedGB: number; // Used storage in GB
  usedPercentage: number; // Percentage of storage used (0-100)
}

/**
 * Converts bytes to gigabytes
 */
const bytesToGB = (bytes: number): number => {
  return Number((bytes / (1024 * 1024 * 1024)).toFixed(2));
};

/**
 * Checks the available and occupied amount of memory (storage) on the device.
 * Note: Using legacy API due to issues with Paths.availableDiskSpace returning incorrect values
 * @returns Promise<StorageUsage>
 */
export const getStorageUsage = async (): Promise<StorageUsage> => {
  try {
    const free = await FileSystem.getFreeDiskStorageAsync();
    const total = await FileSystem.getTotalDiskCapacityAsync();
    const used = total - free;
    const usedPercentage = total > 0 ? (used / total) * 100 : 0;

    return {
      total,
      totalGB: bytesToGB(total),
      free,
      freeGB: bytesToGB(free),
      used,
      usedGB: bytesToGB(used),
      usedPercentage,
    };
  } catch (error) {
    console.error("Error getting storage usage:", error);
    // Return default values or rethrow depending on error handling strategy
    // For now returning 0s to avoid app crash
    return {
      total: 0,
      totalGB: 0,
      free: 0,
      freeGB: 0,
      used: 0,
      usedGB: 0,
      usedPercentage: 0,
    };
  }
};
