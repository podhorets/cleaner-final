import { getSelfies } from "@/src/services/photo/selfies";

import { PhotoGridScreen } from "@/src/shared/components/PhotoGrid/PhotoGridScreen";

export function Selfie() {
  return (
    <PhotoGridScreen
      title="Blurry photos"
      onLoadPhotos={getSelfies}
      categoryId="blurry-photos"
    />
  );
}
