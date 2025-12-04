import { Lock } from "@tamagui/lucide-icons";
import { useCallback, useEffect, useState } from "react";
import { Text, YStack } from "tamagui";

import { PasscodeInput } from "@/src/features/secret-folder/components/PasscodeInput";
import { PasscodeKeypad } from "@/src/features/secret-folder/components/PasscodeKeypad";
import { usePasscode } from "@/src/features/secret-folder/hooks/usePasscode";
import { useSecretFolderStore } from "@/src/features/secret-folder/stores/useSecretFolderStore";
import {
  authenticateWithBiometrics,
  isBiometricAvailable,
} from "@/src/services/biometricService";

type EnterPasscodeProps = {
  onSuccess: () => void;
  onError?: () => void;
};

export function EnterPasscode({ onSuccess, onError }: EnterPasscodeProps) {
  const [error, setError] = useState<string>("");
  const [biometricAvailable, setBiometricAvailable] = useState<boolean>(false);
  const { getPasscode } = useSecretFolderStore();

  const {
    digits,
    isComplete,
    handleDigitPress,
    handleDelete,
    reset,
    getPasscode: getCurrentPasscode,
  } = usePasscode();

  // Check biometric availability on mount
  useEffect(() => {
    const checkBiometric = async () => {
      const available = await isBiometricAvailable();
      setBiometricAvailable(available);
    };
    checkBiometric();
  }, []);

  useEffect(() => {
    if (isComplete) {
      const currentPasscode = getCurrentPasscode();
      const storedPasscode = getPasscode();

      if (currentPasscode === storedPasscode) {
        onSuccess();
      } else {
        setError("Incorrect passcode");
        setTimeout(() => {
          setError("");
          reset();
        }, 600);
        if (onError) {
          onError();
        }
      }
    }
  }, [isComplete, getCurrentPasscode, getPasscode, onSuccess, onError, reset]);

  const handleDigit = useCallback(
    (digit: string) => {
      setError("");
      handleDigitPress(digit);
    },
    [handleDigitPress]
  );

  const handleDeletePress = useCallback(() => {
    setError("");
    handleDelete();
  }, [handleDelete]);

  const handleBiometric = useCallback(async () => {
    setError("");
    const result = await authenticateWithBiometrics();
    if (result.success) {
      onSuccess();
    } else if (result.error) {
      setError(result.error);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  }, [onSuccess]);

  return (
    <YStack
      flex={1}
      bg="$darkBgAlt"
      items="center"
      justify="space-between"
      pb="$10"
    >
      <YStack flex={1} items="center" justify="center" gap={20}>
        {/* Lock Icon */}
        <Lock size={80} color="#0385FF" />

        {/* Title */}
        <Text fs={20} fw="$regular" color="$gray3">
          Enter Passcode
        </Text>

        {/* Error Message */}
        {error ? (
          <Text fs={16} fw="$regular" color="$redPrimary">
            {error}
          </Text>
        ) : null}

        {/* Passcode Input Indicators */}
        <PasscodeInput length={digits.length} />
      </YStack>

      {/* Keypad */}
      <PasscodeKeypad
        onDigitPress={handleDigit}
        onDeletePress={handleDeletePress}
        onBiometricPress={handleBiometric}
        showBiometric={biometricAvailable}
      />
    </YStack>
  );
}
