import * as Contacts from "expo-contacts";

export const findDuplicateContacts = async (): Promise<
  Contacts.ExistingContact[][]
> => {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== "granted") return [];

  const { data } = await Contacts.getContactsAsync({
    fields: [
      Contacts.Fields.PhoneNumbers,
      Contacts.Fields.Emails,
      Contacts.Fields.Name,
      Contacts.Fields.FirstName,
      Contacts.Fields.LastName,
    ],
  });

  const map = new Map<string, Contacts.ExistingContact[]>();

  data.forEach((contact) => {
    contact.phoneNumbers?.forEach((phone) => {
      if (phone && phone.number) {
        const cleaned = phone.number.replace(/\D/g, ""); // remove non-digits
        if (!map.has(cleaned)) map.set(cleaned, []);
        map.get(cleaned)!.push(contact);
      }
    });
  });

  const duplicates = Array.from(map.values()).filter((arr) => arr.length > 1);
  return duplicates;
};
