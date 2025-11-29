import { ScrollView, YStack } from "tamagui";

import { CleanerStatus } from "@/src/features/home/components/CleanerStatus";
import { ImagesAndContacts } from "@/src/features/home/components/ImagesAndContacts";
import { MemoryStorage } from "@/src/features/home/components/MemoryStorage";
import { NavigationBar } from "@/src/features/home/components/NavigationBar";
import { RamAndCpu } from "@/src/features/home/components/RamAndCpu";
import { SecretFolder } from "@/src/features/home/components/SecretFolder";
import { SmartClean } from "@/src/features/home/components/SmartClean";

export function HomeScreen() {
  return (
    <ScrollView>
      <YStack gap="$4" style={{ padding: 16 }} flex={1}>
        <CleanerStatus />
        <SmartClean />
        <RamAndCpu />
        <MemoryStorage />
        <ImagesAndContacts />
        <SecretFolder />
        <NavigationBar />
      </YStack>
    </ScrollView>
  );
}
