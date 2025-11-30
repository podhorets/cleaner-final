import { getStorageUsage, StorageUsage } from "@/src/services/memoryService";
import { measureDownloadSpeed, measureUploadSpeed } from "@/src/services/networkService";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { useEffect, useState } from "react";
import { Stack, Text, YStack } from "tamagui";

export function Selfie() {
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null);
  const [downloadSpeedTestResult, setDownloadSpeedTestResult] = useState<number | null>(null);
  const [uploadSpeedTestResult, setUploadSpeedTestResult] = useState<number | null>(null);


  // Load storage usage ONCE (or whenever dependencies change)
  useEffect(() => {
    const loadUsage = async () => {
      const usage = await getStorageUsage();
      const downloadSpeedTestResult = await measureDownloadSpeed("https://speed.cloudflare.com/__down?bytes=10000000", 10_000_000);
      const uploadSpeedTestResult = await measureUploadSpeed("https://speed.cloudflare.com/__up", 2_000_000);
      setUploadSpeedTestResult(uploadSpeedTestResult);
      setDownloadSpeedTestResult(downloadSpeedTestResult);
      setStorageUsage(usage);
    };

    loadUsage();
  }, []); // ← run once on mount

  return (
    <YStack flex={1} bg="$darkBgAlt">
      <ScreenHeader title="Selfie" />
      <Stack>
        <Text color="$white">Total: {storageUsage?.totalGB} GB ({storageUsage?.total.toLocaleString()} bytes)</Text>
      </Stack>
      <Stack>
        <Text color="$white">Free: {storageUsage?.freeGB} GB ({storageUsage?.free.toLocaleString()} bytes)</Text>
      </Stack>
      <Stack>
        <Text color="$white">Used: {storageUsage?.usedGB} GB ({storageUsage?.used.toLocaleString()} bytes)</Text>
      </Stack>
      <Stack>
        <Text color="$white">____Downloadspeed Speed: {downloadSpeedTestResult} Mbps</Text>
      </Stack>
      <Stack>
        <Text color="$white">____Uploadspeed Speed: {uploadSpeedTestResult} Mbps</Text>
      </Stack>
    </YStack>
  );
}
