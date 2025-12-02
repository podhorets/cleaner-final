import { FaceId, X } from "@tamagui/lucide-icons";
import { Button, Text, XStack, YStack } from "tamagui";

type PasscodeKeypadProps = {
  onDigitPress: (digit: string) => void;
  onDeletePress: () => void;
  onBiometricPress?: () => void;
};

export function PasscodeKeypad({
  onDigitPress,
  onDeletePress,
  onBiometricPress,
}: PasscodeKeypadProps) {
  const handleDigitPress = (digit: string) => {
    onDigitPress(digit);
  };

  const handleDelete = () => {
    onDeletePress();
  };

  const handleBiometric = () => {
    if (onBiometricPress) {
      onBiometricPress();
    }
  };

  return (
    <XStack gap={25} items="flex-start" justify="center">
      {/* Column 1: 1, 4, 7, Biometric */}
      <YStack gap={15} items="center" justify="center">
        <KeypadButton label="1" onPress={() => handleDigitPress("1")} />
        <KeypadButton label="4" onPress={() => handleDigitPress("4")} />
        <KeypadButton label="7" onPress={() => handleDigitPress("7")} />
        <BiometricButton onPress={handleBiometric} />
      </YStack>

      {/* Column 2: 2, 5, 8, 0 */}
      <YStack gap={15} items="center" justify="center">
        <KeypadButton label="2" onPress={() => handleDigitPress("2")} />
        <KeypadButton label="5" onPress={() => handleDigitPress("5")} />
        <KeypadButton label="8" onPress={() => handleDigitPress("8")} />
        <KeypadButton label="0" onPress={() => handleDigitPress("0")} />
      </YStack>

      {/* Column 3: 3, 6, 9, Delete */}
      <YStack gap={15} items="center" justify="center">
        <KeypadButton label="3" onPress={() => handleDigitPress("3")} />
        <KeypadButton label="6" onPress={() => handleDigitPress("6")} />
        <KeypadButton label="9" onPress={() => handleDigitPress("9")} />
        <DeleteButton onPress={handleDelete} />
      </YStack>
    </XStack>
  );
}

function KeypadButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Button
      unstyled
      bg="rgba(66,72,101,0.3)"
      width={68}
      height={68}
      borderRadius={16}
      items="center"
      justify="center"
      onPress={onPress}
    >
      <Text fs={32} fw="$medium" color="$white">
        {label}
      </Text>
    </Button>
  );
}

function BiometricButton({ onPress }: { onPress: () => void }) {
  return (
    <Button
      unstyled
      width={68}
      height={68}
      borderRadius={25}
      items="center"
      justify="center"
      onPress={onPress}
    >
      {/* <FaceId size={32} color="#FFFFFF" /> */}
      <X size={32} color="$blueTertiary" />

    </Button>
  );
}

function DeleteButton({ onPress }: { onPress: () => void }) {
  return (
    <Button
      unstyled
      width={68}
      height={68}
      borderRadius={25}
      items="center"
      justify="center"
      onPress={onPress}
    >
      <X size={32} color="#FFFFFF" />
    </Button>
  );
}

