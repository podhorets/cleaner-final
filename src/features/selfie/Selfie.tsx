import { getStorageUsage, StorageUsage } from "@/src/services/memoryService";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { useEffect, useState } from "react";
import { Stack, Text, YStack } from "tamagui";

export function Selfie() {
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null);

  // Load storage usage ONCE (or whenever dependencies change)
  useEffect(() => {
    const loadUsage = async () => {
      const usage = await getStorageUsage();
      setStorageUsage(usage);
    };

    loadUsage();
  }, []); // ← run once on mount

  return (
    <YStack flex={1} bg="$darkBgAlt">
      <ScreenHeader title="Selfie" />
      <Stack>
        <Text>Total: {storageUsage?.totalGB} GB ({storageUsage?.total.toLocaleString()} bytes)</Text>
      </Stack>
      <Stack>
        <Text>Free: {storageUsage?.freeGB} GB ({storageUsage?.free.toLocaleString()} bytes)</Text>
      </Stack>
      <Stack>
        <Text>Used: {storageUsage?.usedGB} GB ({storageUsage?.used.toLocaleString()} bytes)</Text>
      </Stack>
      <Stack>
        <Text>Used Percentage: {storageUsage?.usedPercentage.toFixed(2)}%</Text>
      </Stack>
    </YStack>
  );
}
