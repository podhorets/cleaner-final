import { useLocalSearchParams } from "expo-router";

import { getSelfies } from "@/src/services/photo/selfies";
import { PhotoCategory } from "@/src/shared/types/categories";

import { PhotoGridScreen } from "@/src/shared/components/PhotoGrid/PhotoGridScreen";

export function Selfie() {
  const params = useLocalSearchParams<{ selectionModeOnly?: string }>();

  return (
    <PhotoGridScreen
      title="Blurry photos"
      onLoadPhotos={getSelfies}
      categoryId={PhotoCategory.BLURRY_PHOTOS}
      selectionModeOnly={params.selectionModeOnly === "true"}
    />
  );
}
