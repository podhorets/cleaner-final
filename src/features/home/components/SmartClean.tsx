import { SmartCleanProgressBar } from "@/src/shared/components/SmartCleanProgressBar";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Card, Stack, Text, YStack } from "tamagui";

import WarningShield from "@/assets/images/warning_shield.svg";

export function SmartClean() {
  const router = useRouter();

  return (
    <Card p="$3.5" br="$6" bg="$darkBlueAlpha30">
      <YStack gap="$3.5">
        <YStack gap="$2">
          <Text color="$white" fs={24} fw="$semibold">
            Smart Cleaner
          </Text>
          <Text color="$white" o={0.5} fs={14} fw="$regular">
            Cleaning has not perfored yet
          </Text>
        </YStack>
        <YStack bg="$whiteAlpha13" br="$6" p="$3" gap="$3.5">
          <SmartCleanProgressBar />
        </YStack>
        <YStack
          bg="$whiteAlpha13"
          br="$6"
          p="$1"
          gap="$2.5"
          items="center"
          position="relative"
        >
          <Stack
            position="absolute"
            top={0}
            right={0}
            width={35}
            height={25}
            bg="$redPrimary"
            items="center"
            justify="center"
            style={{
              borderTopRightRadius: 18,
              borderBottomLeftRadius: 18,
            }}
          >
            <Image
              source={WarningShield}
              style={{ width: 16, height: 16 }}
              contentFit="contain"
            />
          </Stack>
          <Text color="$redPrimary" fs={15} fw="$medium">
            Need cleaning
          </Text>
          <Text color="$white" fs={20} fw="$regular">
            238,2 GB of 256 GB
          </Text>
        </YStack>
        <Stack
          onPress={() => router.push("/smart-clean")}
          bg="$redPrimary"
          br="$6"
          py="$4"
          items="center"
        >
          <Text color="$white" fs={20} fw="$medium">
            START SMART CLEAN
          </Text>
        </Stack>
      </YStack>
    </Card>
  );
}
