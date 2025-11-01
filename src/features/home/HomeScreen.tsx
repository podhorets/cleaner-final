import { ScrollView, YStack } from "tamagui";
import { BottomNavigationBar } from "./components/BottomNavigationBar";
import { QuickAccessRow } from "./components/QuickAccessRow";
import { SecretFolderSection } from "./components/SecretFolderSection";
import { StatusBanner } from "./components/StatusBanner";
import { SystemOverviewCard } from "./components/SystemOverviewCard";
import { UsageBreakdownCard } from "./components/UsageBreakdownCard";
import { UtilityActionsRow } from "./components/UtilityActionsRow";
import {
  bottomNavigationMock,
  quickAccessMock,
  secretFolderMock,
  statusBannerMock,
  systemOverviewMock,
  usageBreakdownMock,
  utilityActionsMock,
} from "./homeMockData";

export function HomeScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <YStack space="$4" style={{ padding: 16 }}>
        <StatusBanner {...statusBannerMock} />
        <UsageBreakdownCard {...usageBreakdownMock} />
        <SystemOverviewCard {...systemOverviewMock} />
        <QuickAccessRow {...quickAccessMock} />
        <SecretFolderSection {...secretFolderMock} />
        <UtilityActionsRow {...utilityActionsMock} />
        <BottomNavigationBar {...bottomNavigationMock} />
      </YStack>
    </ScrollView>
  );
}