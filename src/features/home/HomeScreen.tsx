import { ScrollView, YStack } from "tamagui";

import { CleanerStatus } from "@/src/features/home/components/CleanerStatus";
import { Hardware } from "@/src/features/home/components/Hardware";
import { ImagesAndContacts } from "@/src/features/home/components/ImagesAndContacts";
import { NavigationBar } from "@/src/features/home/components/NavigationBar";
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
        <ImagesAndContacts />
        <Hardware />
        <SecretFolder />
        <NavigationBar />
      </YStack>
    </ScrollView>
  );
}
