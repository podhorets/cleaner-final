/**
 * Photo/Video category types used across the application
 * Uses kebab-case for consistency with routes and URLs
 */
export enum PhotoCategory {
  SCREENSHOTS = "screenshots",
  SELFIES = "selfies",
  BLURRY_PHOTOS = "blurry-photos",
  SIMILAR_PHOTOS = "similar-photos",
  LIVE_PHOTOS = "live-photos",
  LONG_VIDEOS = "long-videos",
}

/**
 * Map category to store key (handles legacy "selfie" and "blurry-photos" -> "selfies")
 */
export const categoryToStoreKey = (
  category: PhotoCategory | string
): PhotoCategory => {
  // Map blurry-photos and legacy "selfie" to selfies
  if (
    category === PhotoCategory.BLURRY_PHOTOS ||
    category === "selfie"
  ) {
    return PhotoCategory.SELFIES;
  }
  // For all other categories, use as-is
  return (category as PhotoCategory) || PhotoCategory.SCREENSHOTS;
};

