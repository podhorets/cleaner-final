import { useRouter } from "expo-router";
import { ScrollView, useThemeName, YStack } from "tamagui";
import { BottomNavigationBar } from "./components/BottomNavigationBar";
import { QuickAccessRow } from "./components/QuickAccessRow";
import { SecretFolderSection } from "./components/SecretFolderSection";
import { StatusBanner } from "./components/StatusBanner";
import { SystemOverviewCard } from "./components/SystemOverviewCard";
import { UsageBreakdownCard } from "./components/UsageBreakdownCard";
import { bottomNavigationMock } from "./homeMockData";

export function HomeScreen() {
  const themeName = useThemeName();
  const router = useRouter();
  return (
    <ScrollView showsVerticalScrollIndicator={false} bg="$bg">
      <YStack gap="$4" style={{ padding: 16 }} flex={1}>
        <StatusBanner />
        <UsageBreakdownCard />
        <QuickAccessRow />
        <SystemOverviewCard />
        <SecretFolderSection />
        <BottomNavigationBar {...bottomNavigationMock} />
      </YStack>
    </ScrollView>
  );
}
