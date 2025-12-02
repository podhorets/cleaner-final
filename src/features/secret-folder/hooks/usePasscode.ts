import { useCallback, useState } from "react";

const MAX_PASSCODE_LENGTH = 4;

export function usePasscode() {
  const [digits, setDigits] = useState<string[]>([]);

  const isComplete = digits.length === MAX_PASSCODE_LENGTH;

  const handleDigitPress = useCallback((digit: string) => {
    setDigits((prev) => {
      if (prev.length >= MAX_PASSCODE_LENGTH) {
        return prev;
      }
      return [...prev, digit];
    });
  }, []);

  const handleDelete = useCallback(() => {
    setDigits((prev) => {
      if (prev.length === 0) {
        return prev;
      }
      return prev.slice(0, -1);
    });
  }, []);

  const reset = useCallback(() => {
    setDigits([]);
  }, []);

  const getPasscode = useCallback(() => {
    return digits.join("");
  }, [digits]);

  return {
    digits,
    isComplete,
    handleDigitPress,
    handleDelete,
    reset,
    getPasscode,
  };
}

