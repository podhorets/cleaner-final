import { getSelfies } from "@/src/services/photoService";

import { PhotoGridScreen } from "@/src/shared/components/PhotoGridScreen";

export function Selfie() {
  return <PhotoGridScreen title="Blurry photos" onLoadPhotos={getSelfies} categoryId="blurry-photos" />;
}
