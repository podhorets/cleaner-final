import { getLongVideos } from "@/src/services/photoService";

import { PhotoGridScreen } from "@/src/shared/components/PhotoGrid/PhotoGridScreen";

export function LongVideos() {
  return (
    <PhotoGridScreen
      title="Long videos"
      onLoadPhotos={getLongVideos}
      categoryId="long-videos"
    />
  );
}
