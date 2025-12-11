import { ScrollView, YStack } from "tamagui";

import { CleanerStatus } from "@/src/features/home/components/CleanerStatus";
import { ImagesAndContacts } from "@/src/features/home/components/ImagesAndContacts";
import { MemoryStorage } from "@/src/features/home/components/MemoryStorage";
import { RamAndCpu } from "@/src/features/home/components/RamAndCpu";
import { SecretFolder } from "@/src/features/home/components/SecretFolder";
import { SmartClean } from "@/src/features/home/components/SmartClean";
import { SpeedTest } from "@/src/features/home/components/SpeedTest";
import { SystemInfo } from "@/src/features/home/components/SystemInfo";

export function HomeScreen() {
  return (
    <ScrollView>
      <YStack gap="$4" p="$3.5">
        <CleanerStatus />
        <SmartClean />
        <RamAndCpu />
        <MemoryStorage />
        <ImagesAndContacts />
        <SecretFolder />
        <SpeedTest />
        <SystemInfo />
      </YStack>
    </ScrollView>
  );
}
