import * as Contacts from "expo-contacts";
import { useCallback } from "react";
import { FlatList } from "react-native";
import { Text, YStack } from "tamagui";

import { ContactItem } from "@/src/shared/components/ContactItem";

const GROUP_GAP = 15;

export type ContactGroup = {
  id: string;
  contacts: Contacts.ExistingContact[];
};

type ContactGroupItemProps = {
  group: ContactGroup;
  selectedIds: Set<string>;
  onToggleContact: (contactId: string) => void;
};

const ContactGroupItem = ({
  group,
  selectedIds,
  onToggleContact,
}: ContactGroupItemProps) => {
  return (
    <YStack gap="$2" items="center">
      {/* Count Label */}
      <Text fs={15} fw="$medium" color="$blueTertiary">
        {group.contacts.length} items
      </Text>

      {/* Contacts List */}
      <YStack gap="$2" width="100%">
        {group.contacts.map((contact) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            isSelected={selectedIds.has(contact.id)}
            onToggle={onToggleContact}
          />
        ))}
      </YStack>
    </YStack>
  );
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
        paddingHorizontal: 16,
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
