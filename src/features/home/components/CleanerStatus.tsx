import { Image } from "expo-image";
import { Card, Stack, Text, XStack, YStack } from "tamagui";

import CleaningStatusDone from "@/assets/images/cleaning_status_done.svg";
import CleaningStatusRequired from "@/assets/images/cleaning_status_required.svg";

export function CleanerStatus() {
  const { icon, title, text, bgColor } = CLEANER_STATUS_CONFIG[2];

  return (
    <Card p="$2.5" br="$6" bg={bgColor}>
      <XStack items="center" gap="$3.5">
        <Stack py="$1.5" pl="$2.5">
          <Image
            source={icon.src}
            style={{ width: icon.width, height: icon.width }}
            contentFit="contain"
          />
        </Stack>
        <YStack gap="$2">
          <Text color="#FFFFFF" fs={20} fw="$medium">
            {title}
          </Text>
          <Text color="#959494" fs={16} fw="$regular">
            {text}
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
}

enum Status {
  Done,
  Attention,
  Cleaning,
}

const CLEANER_STATUS_CONFIG = [
  {
    type: Status.Done,
    title: "Clean is done",
    text: "Cleaning was successful",
    icon: {
      src: CleaningStatusDone,
      width: 44,
      height: 44,
    },
    bgColor: "#26b13c4d",
  },
  {
    type: Status.Attention,
    title: "Attention",
    text: "Last clean: {date}",
    icon: {
      src: CleaningStatusRequired,
      width: 44,
      height: 38,
    },
    bgColor: "#dd39304d",
  },
  {
    type: Status.Cleaning,
    title: "No Cleaning",
    text: "We recommend clean your device",
    icon: {
      src: CleaningStatusRequired,
      width: 44,
      height: 38,
    },
    bgColor: "#dd39304d",
  },
] as const;
