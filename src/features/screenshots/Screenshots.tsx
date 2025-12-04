import { getScreenshots } from "@/src/services/photoService";

import { PhotoGridScreen } from "@/src/shared/components/PhotoGrid/PhotoGridScreen";

export function Screenshots() {
  return (
    <PhotoGridScreen
      title="Screenshots"
      onLoadPhotos={getScreenshots}
      categoryId="screenshots"
    />
  );
}
