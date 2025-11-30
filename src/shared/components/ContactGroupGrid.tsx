import * as Contacts from "expo-contacts";
import { useCallback } from "react";
import { FlatList } from "react-native";

import { ContactGroupItem } from "@/src/shared/components/ContactGroupItem";

const GROUP_GAP = 10;

export type ContactGroup = {
  id: string;
  contacts: Contacts.Contact[];
};

type ContactGroupGridProps = {
  groups: ContactGroup[];
  selectedIds: Set<string>;
  onToggleContact: (contactId: string) => void;
};

export function ContactGroupGrid({
  groups,
  selectedIds,
  onToggleContact,
}: ContactGroupGridProps) {
  const renderGroup = useCallback(
    ({ item }: { item: ContactGroup }) => (
      <ContactGroupItem
        group={item}
        selectedIds={selectedIds}
        onToggleContact={onToggleContact}
      />
    ),
    [selectedIds, onToggleContact]
  );

  const keyExtractor = useCallback((item: ContactGroup) => item.id, []);

  return (
    <FlatList
      data={groups}
      renderItem={renderGroup}
      keyExtractor={keyExtractor}
      contentContainerStyle={{
        paddingTop: 16,
        paddingBottom: 100,
        gap: GROUP_GAP,
      }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={100}
      initialNumToRender={3}
      windowSize={5}
    />
  );
}
