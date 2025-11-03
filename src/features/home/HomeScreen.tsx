import { ScrollView, YStack } from "tamagui";
import { CleanerStatus } from "./components/CleanerStatus";
import { Hardware } from "./components/Hardware";
import { ImagesAndContacts } from "./components/ImagesAndContacts";
import { MemoryUsage } from "./components/MemoryUsage";
import { NavigationBar } from "./components/NavigationBar";
import { SecretFolder } from "./components/SecretFolder";

export function HomeScreen() {
  // const themeName = useThemeName();
  // const router = useRouter();
  return (
    <ScrollView>
      <YStack gap="$4" style={{ padding: 16 }} flex={1}>
        <CleanerStatus />
        <MemoryUsage />
        <ImagesAndContacts />
        <Hardware />
        <SecretFolder />
        <NavigationBar />
      </YStack>
    </ScrollView>
  );
}
