import { useCallback, useEffect, useState } from "react";

import { Photo } from "@/src/types/models";

type UsePhotoSelectionOptions = {
  photos: Photo[];
};

export function usePhotoSelection({ photos }: UsePhotoSelectionOptions) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState(false);

  const togglePhoto = useCallback((photoId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (isSelectAll) {
      setSelectedIds(new Set());
      setIsSelectAll(false);
    } else {
      const allIds = new Set<string>();
      photos.forEach((photo) => {
        allIds.add(photo.id);
      });
      setSelectedIds(allIds);
      setIsSelectAll(true);
    }
  }, [isSelectAll, photos]);

  // Update select all state when selection changes
  useEffect(() => {
    setIsSelectAll(photos.length > 0 && selectedIds.size === photos.length);
  }, [selectedIds, photos.length]);

  return {
    selectedIds,
    isSelectAll,
    togglePhoto,
    toggleSelectAll,
  };
}

