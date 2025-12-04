import { getScreenshots } from "@/src/services/photo/screenshots";

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
