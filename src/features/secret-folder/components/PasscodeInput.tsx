import { XStack } from "tamagui";

type PasscodeInputProps = {
  length: number;
  maxLength?: number;
};

export function PasscodeInput({ length, maxLength = 4 }: PasscodeInputProps) {
  return (
    <XStack gap={20} items="center" justify="center">
      {Array.from({ length: maxLength }).map((_, index) => {
        const isFilled = index < length;
        return (
          <XStack
            key={index}
            width={15}
            height={15}
            borderRadius={102.5}
            borderWidth={1}
            borderColor={"$blueTertiary"}
            bg={isFilled ? "$blueTertiary" : "transparent"}
          />
        );
      })}
    </XStack>
  );
}
