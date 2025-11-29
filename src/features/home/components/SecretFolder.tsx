import ArrowRight from "@/assets/images/arrow_right.svg";
import GalleryFrame from "@/assets/images/gallery_frame.svg";
import PersonFrame from "@/assets/images/person_frame.svg";
import Folder from "@/assets/images/secret_folder.svg";
import VideoFrame from "@/assets/images/video_frame.svg";
import { Image } from "expo-image";
import { Stack, Text, XStack, YStack } from "tamagui";

const tiles = [
  { id: "ct", label: "Contacts:", count: "13", icon: PersonFrame },
  { id: "ph", label: "Photos:", count: "1 198", icon: GalleryFrame },
  { id: "vd", label: "Videos:", count: "431", icon: VideoFrame },
];

export function SecretFolder() {
  return (
    <YStack px="$3.5" pt="$3" pb="$2.5" br="$6" bg="$darkBlueAlpha30">
      <XStack items="center" justify="space-between">
        <YStack gap="$1.5">
          <Text fs={26} fw="$medium" color="$white">
            Secret Folder
          </Text>
          <Text fs={17} fw="$regular" color="$white" o={0.5}>
            last change: 16 apr
          </Text>
        </YStack>
        <Image
          source={ArrowRight}
          style={{ width: 24, height: 24 }}
          contentFit="contain"
        />
      </XStack>
      <XStack items="center" justify="space-between">
        <YStack gap="$1.5">
          {tiles.map((tile) => (
            <YStack key={tile.id} gap="$2">
              <XStack gap="$2" items="center">
                <Image
                  source={tile.icon}
                  style={{ width: 16, height: 16 }}
                  contentFit="contain"
                />

                <XStack gap="$1.5" items="center">
                  <Text fs={16} fw="$regular" color="$white">
                    {tile.label}
                  </Text>
                  <Text fs={18} fw="$medium" color="$white">
                    {tile.count}
                  </Text>
                </XStack>
              </XStack>
            </YStack>
          ))}
        </YStack>
        <Stack bg="$whiteAlpha13" br="$6" px="$2" pt="$3.5">
          <Image
            source={Folder}
            style={{ width: 103, height: 95 }}
            contentFit="contain"
          />
        </Stack>
      </XStack>
    </YStack>
  );
}
