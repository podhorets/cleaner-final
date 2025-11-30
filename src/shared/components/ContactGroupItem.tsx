import Checked from "@/assets/images/checked_checkbox.svg";
import * as Contacts from "expo-contacts";
import { Image } from "expo-image";
import { memo, useCallback } from "react";
import { Pressable } from "react-native";
import { Stack, Text, XStack, YStack } from "tamagui";

import { ContactDuplicateItem } from "@/src/shared/components/ContactDuplicateItem";

type ContactGroupItemProps = {
  group: {
    id: string;
    contacts: Contacts.ExistingContact[];
  };
  selectedIds: Set<string>;
  onToggleContact: (contactId: string) => void;
};

function getContactDisplayName(contact: Contacts.ExistingContact): string {
  if (contact.name) return contact.name;
  if (contact.firstName || contact.lastName) {
    return [contact.firstName, contact.lastName].filter(Boolean).join(" ");
  }
  return "Unknown";
}

export const ContactGroupItem = memo(
  ({ group, selectedIds, onToggleContact }: ContactGroupItemProps) => {
    // First contact is the main one, rest are duplicates
    const mainContact = group.contacts[0];
    const duplicates = group.contacts.slice(1);

    const mainContactName = getContactDisplayName(mainContact);
    const mainContactId = mainContact.id;
    const isMainSelected = mainContactId ? selectedIds.has(mainContactId) : false;

    const handleMainToggle = useCallback(() => {
      if (mainContactId) {
        onToggleContact(mainContactId);
      }
    }, [mainContactId, onToggleContact]);

    return (
      <YStack
        gap={10}
        pb={20}
        pt={15}
        px={16}
        width="100%"
      >
        {/* Contact Name Section */}
        <YStack gap={5} width="100%">
          {/* "Contact name" Label */}
          <Text fs={13} fw="$regular" color="#999999">
            Contact name
          </Text>

          {/* Main Contact Name with Checkbox */}
          <XStack items="center" justify="space-between" width="100%">
            <Pressable onPress={handleMainToggle} style={{ flex: 1 }}>
              <Text fs={16} fw="$semibold" color="$white" numberOfLines={1}>
                {mainContactName}
              </Text>
            </Pressable>

            <Pressable onPress={handleMainToggle}>
              <Stack
                bg={isMainSelected ? "$blueTertiary" : "rgba(234,234,234,0.3)"}
                borderWidth={isMainSelected ? 0 : 2}
                borderColor="rgba(245,245,245,0.6)"
                br="$2"
                width={24}
                height={24}
                items="center"
                justify="center"
              >
                {isMainSelected && (
                  <Image
                    source={Checked}
                    style={{ width: 12, height: 12 }}
                    contentFit="contain"
                  />
                )}
              </Stack>
            </Pressable>
          </XStack>
        </YStack>

        {/* Duplicates Section */}
        {duplicates.length > 0 && (
          <YStack gap={15} width="100%">
            {/* "Duplicate" Label */}
            <Text fs={13} fw="$regular" color="#999999">
              Duplicate
            </Text>

            {/* Duplicate Entries List */}
            <YStack gap={10} width="100%">
              {duplicates.map((contact) => {
                const contactId = (contact as Contacts.ExistingContact).id;
                return (
                  <ContactDuplicateItem
                    key={contactId}
                    contact={contact}
                    isSelected={contactId ? selectedIds.has(contactId) : false}
                    onToggle={onToggleContact}
                  />
                );
              })}
            </YStack>
          </YStack>
        )}
      </YStack>
    );
  }
);

ContactGroupItem.displayName = "ContactGroupItem";

