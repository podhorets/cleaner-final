import * as Contacts from "expo-contacts";
import { useCallback, useEffect, useState } from "react";

type UseContactSelectionOptions = {
  contacts: Contacts.ExistingContact[];
};

export function useContactSelection({ contacts }: UseContactSelectionOptions) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState(false);

  const toggleContact = useCallback((contactId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(contactId)) {
        next.delete(contactId);
      } else {
        next.add(contactId);
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
      contacts.forEach((contact) => {
        allIds.add(contact.id);
      });
      setSelectedIds(allIds);
      setIsSelectAll(true);
    }
  }, [isSelectAll, contacts]);

  // Update select all state when selection changes
  useEffect(() => {
    setIsSelectAll(contacts.length > 0 && selectedIds.size === contacts.length);
  }, [selectedIds, contacts.length]);

  return {
    selectedIds,
    isSelectAll,
    toggleContact,
    toggleSelectAll,
  };
}
