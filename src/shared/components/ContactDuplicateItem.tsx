import Checked from "@/assets/images/checked_checkbox.svg";
import { Image } from "expo-image";
import { memo, useCallback } from "react";
import { Pressable } from "react-native";
import * as Contacts from "expo-contacts";
import { Stack, Text, XStack } from "tamagui";

type ContactDuplicateItemProps = {
  contact: Contacts.Contact;
  isSelected: boolean;
  onToggle: (contactId: string) => void;
};

function getContactInitials(contact: Contacts.Contact): string {
  const firstName = contact.firstName || "";
  const lastName = contact.lastName || "";
  const name = contact.name || "";

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  }
  return "?";
}

function getContactPhoneNumber(contact: Contacts.Contact): string {
  if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
    return contact.phoneNumbers[0].number || "";
  }
  return "";
}

export const ContactDuplicateItem = memo(
  ({ contact, isSelected, onToggle }: ContactDuplicateItemProps) => {
    const contactId = (contact as Contacts.ExistingContact).id;
    const handlePress = useCallback(() => {
      if (contactId) {
        onToggle(contactId);
      }
    }, [contactId, onToggle]);

    const initials = getContactInitials(contact);
    const phoneNumber = getContactPhoneNumber(contact);

    return (
      <Pressable onPress={handlePress}>
        <XStack
          items="center"
          justify="space-between"
          pl={20}
          pr={0}
          py={0}
          width="100%"
        >
          <XStack gap={16} items="center" flex={1}>
            {/* Small Avatar */}
            <Stack
              bg="$blueTertiary"
              br="$2.5"
              width={33}
              height={33}
              items="center"
              justify="center"
            >
              <Text fs={12} fw="$medium" color="$white">
                {initials}
              </Text>
            </Stack>

            {/* Phone Number */}
            {phoneNumber && (
              <Text fs={12} fw="$regular" color="#888890" numberOfLines={1}>
                {phoneNumber}
              </Text>
            )}
          </XStack>

          {/* Checkbox */}
          <Stack
            bg={isSelected ? "$blueTertiary" : "rgba(234,234,234,0.3)"}
            borderWidth={isSelected ? 0 : 2}
            borderColor="rgba(245,245,245,0.6)"
            br="$2"
            width={24}
            height={24}
            items="center"
            justify="center"
          >
            {isSelected && (
              <Image
                source={Checked}
                style={{ width: 12, height: 12 }}
                contentFit="contain"
              />
            )}
          </Stack>
        </XStack>
      </Pressable>
    );
  }
);

ContactDuplicateItem.displayName = "ContactDuplicateItem";

