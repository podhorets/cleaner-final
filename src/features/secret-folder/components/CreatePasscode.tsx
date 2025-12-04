import { Lock } from "@tamagui/lucide-icons";
import { useCallback, useEffect, useState } from "react";
import { Text, YStack } from "tamagui";

import { usePasscode } from "@/src/features/secret-folder/hooks/usePasscode";
import { useSecretFolderStore } from "@/src/features/secret-folder/stores/useSecretFolderStore";
import { PasscodeInput } from "@/src/shared/components/PasscodeInput";
import { PasscodeKeypad } from "@/src/shared/components/PasscodeKeypad";

type CreatePasscodeProps = {
  onComplete: () => void;
};

type Step = "initial" | "confirmation";

export function CreatePasscode({ onComplete }: CreatePasscodeProps) {
  const [step, setStep] = useState<Step>("initial");
  const [initialPasscode, setInitialPasscode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { setPasscode } = useSecretFolderStore();

  const {
    digits,
    isComplete,
    handleDigitPress,
    handleDelete,
    reset,
    getPasscode,
  } = usePasscode();

  useEffect(() => {
    if (isComplete) {
      const currentPasscode = getPasscode();

      if (step === "initial") {
        setInitialPasscode(currentPasscode);
        setStep("confirmation");
        reset();
      } else if (step === "confirmation") {
        if (currentPasscode === initialPasscode) {
          setPasscode(currentPasscode);
          onComplete();
        } else {
          setError("Passcodes do not match");
          setTimeout(() => {
            setError("");
            setStep("initial");
            setInitialPasscode("");
            reset();
          }, 600);
        }
      }
    }
  }, [
    isComplete,
    step,
    initialPasscode,
    getPasscode,
    setPasscode,
    onComplete,
    reset,
  ]);

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

  const getTitle = () => {
    if (step === "initial") {
      return "Create New Passcode";
    }
    return "Confirm Passcode";
  };

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
          {getTitle()}
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
        showBiometric={false}
      />
    </YStack>
  );
}
