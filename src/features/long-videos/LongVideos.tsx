import { useLocalSearchParams } from "expo-router";

import { getLongVideos } from "@/src/services/photo/videos";
import { PhotoCategory } from "@/src/shared/types/categories";
import { Photo } from "@/src/types/models";

import { PhotoGridScreen } from "@/src/shared/components/PhotoGrid/PhotoGridScreen";

export function LongVideos() {
  const params = useLocalSearchParams<{ selectionModeOnly?: string }>();

  const loadPhotos = async (): Promise<Photo[]> => {
    const assets = await getLongVideos();
    return assets.map((asset) => ({
      uri: asset.uri,
      id: asset.id,
    }));
  };

  return (
    <PhotoGridScreen
      title="Long videos"
      onLoadPhotos={loadPhotos}
      categoryId={PhotoCategory.LONG_VIDEOS}
      selectionModeOnly={params.selectionModeOnly === "true"}
    />
  );
}
