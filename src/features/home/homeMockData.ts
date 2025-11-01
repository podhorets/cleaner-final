import { BottomNavigationBarProps } from "./components/BottomNavigationBar";
import { QuickAccessRowProps } from "./components/QuickAccessRow";
import { SecretFolderSectionProps } from "./components/SecretFolderSection";
import { StatusBannerProps } from "./components/StatusBanner";
import { SystemOverviewCardProps } from "./components/SystemOverviewCard";
import { UsageBreakdownCardProps } from "./components/UsageBreakdownCard";
import { UtilityActionsRowProps } from "./components/UtilityActionsRow";

export const statusBannerMock: StatusBannerProps = {
  state: "idle",
  title: "No Cleaning",
  subtitle: "Clean your phone",
};

export const usageBreakdownMock: UsageBreakdownCardProps = {
  slices: [
    { label: "Photo", value: 80, color: "$pink9" },
    { label: "Apps", value: 72, color: "$blue9" },
    { label: "Drive", value: 40, color: "$purple9" },
    { label: "System", value: 60, color: "$green9" },
    { label: "Other", value: 35, color: "$yellow9" },
  ],
  totalUsed: "123.8 GB",
  totalCapacity: "216 GB",
};

export const systemOverviewMock: SystemOverviewCardProps = {
  deviceName: "iPhone 15 Pro Max",
  osVersion: "iOS 17",
  occupancyLabel: "Occupied - 123.8 / 216 GB",
  metrics: [
    { id: "temp", label: "Temperature", value: "34 deg C" },
    { id: "battery", label: "Battery", value: "32 %" },
    { id: "free", label: "Free Space", value: "32 GB" },
  ],
};

export const quickAccessMock: QuickAccessRowProps = {
  links: [
    { id: "images", label: "Images", count: "1 198 items" },
    { id: "contacts", label: "Contacts", count: "1 198 items" },
  ],
};

export const secretFolderMock: SecretFolderSectionProps = {
  tiles: [
    { id: "images", label: "Images", count: "1 198 items", emphasis: "primary" },
    { id: "contacts", label: "Contacts", count: "1 198 items" },
    { id: "pass", label: "My Pass", count: "1 198 items" },
  ],
};

export const utilityActionsMock: UtilityActionsRowProps = {
  actions: [
    { id: "Alert", label: "!" },
    { id: "Scan", label: "-" },
    { id: "Boost", label: "+" },
    { id: "Secure", label: "#" },
  ],
};

export const bottomNavigationMock: BottomNavigationBarProps = {
  items: [
    { id: "home", label: "Home", active: true },
    { id: "clean", label: "Clean" },
    { id: "files", label: "Files" },
    { id: "settings", label: "Settings" },
  ],
};