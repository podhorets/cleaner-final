import { useLocalSearchParams } from "expo-router";

import { getScreenshots } from "@/src/services/photo/screenshots";
import { PhotoCategory } from "@/src/shared/types/categories";

import { PhotoGridScreen } from "@/src/shared/components/PhotoGrid/PhotoGridScreen";

export function Screenshots() {
  const params = useLocalSearchParams<{ selectionModeOnly?: string }>();

  return (
    <PhotoGridScreen
      title="Screenshots"
      onLoadPhotos={getScreenshots}
      categoryId={PhotoCategory.SCREENSHOTS}
      selectionModeOnly={params.selectionModeOnly === "true"}
    />
  );
}
