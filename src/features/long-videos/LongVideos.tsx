import { getLongVideos } from "@/src/services/photoService";

import { PhotoGridScreen } from "@/src/shared/components/PhotoGridScreen";

export function LongVideos() {
  return <PhotoGridScreen title="Long videos" onLoadPhotos={getLongVideos} />;
}
