import { getBlurryPhotos } from "@/src/services/photoService";

import { PhotoGridScreen } from "@/src/shared/components/PhotoGridScreen";

export function BlurryPhotos() {
  return (
    <PhotoGridScreen title="Blurry photos" onLoadPhotos={getBlurryPhotos} />
  );
}
