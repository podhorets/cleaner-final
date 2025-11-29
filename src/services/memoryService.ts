import * as FileSystem from "expo-file-system";

export interface StorageUsage {
  total: number; // Total storage capacity in bytes
  free: number; // Free storage available in bytes
  used: number; // Used storage in bytes
  usedPercentage: number; // Percentage of storage used (0-100)
}

/**
 * Checks the available and occupied amount of memory (storage) on the device.
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
      free,
      used,
      usedPercentage,
    };
  } catch (error) {
    console.error("Error getting storage usage:", error);
    // Return default values or rethrow depending on error handling strategy
    // For now returning 0s to avoid app crash
    return {
      total: 0,
      free: 0,
      used: 0,
      usedPercentage: 0,
    };
  }
};
