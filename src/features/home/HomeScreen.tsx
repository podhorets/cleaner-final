import { ScrollView, YStack } from "tamagui";

import { CleanerStatus } from "@/src/features/home/components/CleanerStatus";
import { Hardware } from "@/src/features/home/components/Hardware";
import { ImagesAndContacts } from "@/src/features/home/components/ImagesAndContacts";
import { NavigationBar } from "@/src/features/home/components/NavigationBar";
import { RamAndCpu } from "@/src/features/home/components/RamAndCpu";
import { SecretFolder } from "@/src/features/home/components/SecretFolder";
import { SmartClean } from "@/src/features/home/components/SmartClean";

export function HomeScreen() {
  // const themeName = useThemeName();
  // const router = useRouter();
  return (
    <ScrollView>
      <YStack gap="$4" style={{ padding: 16 }} flex={1}>
        <CleanerStatus />
        <SmartClean />
        <RamAndCpu />
        <Hardware />
        <ImagesAndContacts />
        <SecretFolder />
        <NavigationBar />
      </YStack>
    </ScrollView>
  );
}
