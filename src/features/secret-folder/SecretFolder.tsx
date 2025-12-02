import { useCallback } from "react";
import { YStack } from "tamagui";
import { useRouter } from "expo-router";

import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { CreatePasscode } from "@/src/features/secret-folder/components/CreatePasscode";
import { EnterPasscode } from "@/src/features/secret-folder/components/EnterPasscode";
import { useSecretFolderStore } from "@/src/features/secret-folder/stores/useSecretFolderStore";

export function SecretFolder() {
  const router = useRouter();
  const hasPasscode = useSecretFolderStore((state) => state.passcode !== null);

  const handleCreateComplete = useCallback(() => {
    // Passcode created successfully, navigate to secret folder content
    // TODO: Navigate to secret folder content screen
    router.back();
  }, [router]);

  const handleEnterSuccess = useCallback(() => {
    // Passcode entered successfully, navigate to secret folder content
    // TODO: Navigate to secret folder content screen
    router.back();
  }, [router]);

  return (
    <YStack flex={1} bg="$darkBgAlt">
      <ScreenHeader title={hasPasscode ? "Enter Passcode" : "Create Passcode"} />
      {hasPasscode ? (
        <EnterPasscode onSuccess={handleEnterSuccess} />
      ) : (
        <CreatePasscode onComplete={handleCreateComplete} />
      )}
    </YStack>
  );
}

