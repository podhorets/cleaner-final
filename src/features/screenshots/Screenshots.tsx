import { getScreenshots } from "@/src/services/photoService";

import { PhotoGridScreen } from "@/src/shared/components/PhotoGridScreen";

// Convenience component for Screenshots
export function Screenshots() {
  return <PhotoGridScreen title="Screenshots" onLoadPhotos={getScreenshots} />;
}
