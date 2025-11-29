import Checked from "@/assets/images/checked_checkbox.svg";
import { Image } from "expo-image";
import { memo, useCallback } from "react";
import { Pressable } from "react-native";
import * as Contacts from "expo-contacts";
import { Stack, Text, XStack, YStack } from "tamagui";

type ContactItemProps = {
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

function getContactDisplayName(contact: Contacts.Contact): string {
  if (contact.name) return contact.name;
  if (contact.firstName || contact.lastName) {
    return [contact.firstName, contact.lastName].filter(Boolean).join(" ");
  }
  return "Unknown";
}

function getContactSubtitle(contact: Contacts.Contact): string {
  if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
    return contact.phoneNumbers[0].number || "";
  }
  if (contact.emails && contact.emails.length > 0) {
    return contact.emails[0].email || "";
  }
  return "";
}

export const ContactItem = memo(({ contact, isSelected, onToggle }: ContactItemProps) => {
  const handlePress = useCallback(() => {
    onToggle(contact.id);
  }, [contact.id, onToggle]);

  const initials = getContactInitials(contact);
  const displayName = getContactDisplayName(contact);
  const subtitle = getContactSubtitle(contact);

  return (
    <Pressable onPress={handlePress} style={{ position: "relative" }}>
      <XStack
        bg="$darkBlueAlpha30"
        br="$6"
        p="$3"
        gap="$3"
        items="center"
        minHeight={80}
      >
        {/* Avatar */}
        <Stack
          bg="$whiteAlpha13"
          br="$6"
          width={50}
          height={50}
          items="center"
          justify="center"
        >
          {contact.imageAvailable && contact.imageUri ? (
            <Image
              source={{ uri: contact.imageUri }}
              style={{ width: 50, height: 50, borderRadius: 12 }}
              contentFit="cover"
            />
          ) : (
            <Text fs={18} fw="$semibold" color="$white">
              {initials}
            </Text>
          )}
        </Stack>

        {/* Name and Info */}
        <YStack gap="$1" flex={1}>
          <Text fs={16} fw="$medium" color="$white" numberOfLines={1}>
            {displayName}
          </Text>
          {subtitle && (
            <Text fs={14} fw="$regular" color="$textSecondary" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </YStack>

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
});

ContactItem.displayName = "ContactItem";

