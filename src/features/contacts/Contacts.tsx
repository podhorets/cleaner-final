import { useEffect, useMemo, useState } from "react";
import { Text, YStack } from "tamagui";

import { findDuplicateContacts } from "@/src/services/duplicateContactsService";
import {
  ContactGroupGrid,
  type ContactGroup,
} from "@/src/shared/components/ContactGroupGrid";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { useContactSelection } from "@/src/shared/hooks/useContactSelection";

export function DuplicateContacts() {
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get all contacts from groups for selection hook
  const allContacts = useMemo(() => {
    return groups.flatMap((group) => group.contacts);
  }, [groups]);

  const { selectedIds, isSelectAll, toggleContact, toggleSelectAll } =
    useContactSelection({ contacts: allContacts });

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setIsLoading(true);
        const duplicateGroups = await findDuplicateContacts();
        const contactGroups: ContactGroup[] = duplicateGroups.map(
          (group, index) => ({
            id: `group-${index}`,
            contacts: group,
          })
        );
        setGroups(contactGroups);
      } catch (error) {
        console.error("Failed to load duplicate contacts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, []);

  if (isLoading) {
    return (
      <YStack flex={1} bg="$darkBgAlt">
        <ScreenHeader title="Duplicate contacts" />
        <YStack flex={1} items="center" justify="center">
          <Text fs={16} fw="$regular" color="$white">
            Loading contacts...
          </Text>
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$darkBgAlt">
      <ScreenHeader
        title="Duplicate contacts"
        rightAction={{
          label: isSelectAll ? "Deselect All" : "Select All",
          onPress: toggleSelectAll,
        }}
      />
      <ContactGroupGrid
        groups={groups}
        selectedIds={selectedIds}
        onToggleContact={toggleContact}
      />
    </YStack>
  );
}

// Export alias for Contacts
export const Contacts = DuplicateContacts;
