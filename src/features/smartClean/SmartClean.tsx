import { Copy, Droplet, Image, Users } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import {
  Button,
  Card,
  Progress,
  ScrollView,
  Stack,
  Text,
  XStack,
  YStack,
} from "tamagui";

type CleanItem = {
  id: string;
  label: string;
  count: string;
  size: string;
  icon: any;
};

const items: CleanItem[] = [
  {
    id: "screenshots",
    label: "Screenshots",
    count: "1976",
    size: "126GB",
    icon: Image,
  },
  {
    id: "dup-photos",
    label: "Duplicate photos",
    count: "4",
    size: "10.00MB",
    icon: Copy,
  },
  {
    id: "blurry",
    label: "Blurry photos",
    count: "0",
    size: "10.00MB",
    icon: Droplet,
  },
  {
    id: "dup-numbers",
    label: "Duplicate numbers",
    count: "0",
    size: "12.00MB",
    icon: Users,
  },
];

export function SmartClean() {
  const router = useRouter();

  return (
    <ScrollView>
      <YStack gap="$6" p="$3">
        {/* Header */}
        <XStack items="center">
          <Text
            onPress={() => router.back()}
            fs={16}
            fw="$medium"
            color="$white"
            o={0.7}
          >
            {"< Back"}
          </Text>
        </XStack>

        {/* Title and usage */}
        <YStack gap="$2.5" items="center">
          <Text color="$blueSecondary" fs={34} fw="$semibold">
            Smart Cleaner
          </Text>
          <Text color="$white" o={0.6} fs={14} fw="$regular">
            YOUR SYSTEM IS LOADED ON
          </Text>
          <Text color="$white" fs={32} fw="$semibold">
            226.00
            <Text fs={24} o={0.6} fw="$regular">
              {" "}
              GB
            </Text>
          </Text>
          <Stack px="$4" mt="$2" width="100%">
            <Progress value={76} br="$10" height={20} bg="#ffffff33">
            <Progress.Indicator br="$10" bg="$blueSecondary" />
            </Progress>
          </Stack>
          <XStack gap="$2" mt="$2" items="center">
            <Text color="$white" o={0.6} fs={14} fw="$regular">
              LAST CLEARING
            </Text>
            <Text color="$white" o={0.8} fs={14} fw="$medium">
              2 NOV
            </Text>
          </XStack>
        </YStack>

        {/* Clean-up files */}
        <Card py="$4" px="$2" br="$9" bg="#FFFFFF05">
          <YStack gap="$3">
            <YStack gap="$1" px="$2">
              <Text color="$white" o={0.6} fs={14} fw="$regular">
                CLEAN-UP FILES
              </Text>
              <Text color="$white" o={0.6} fs={12} fw="$light">
                You can go to the section and see the files found.
              </Text>
            </YStack>

            <XStack gap="$3.5" rowGap="$3.5" flexWrap="wrap" justify="center">
              {items.map((it) => (
                <CleanCard key={it.id} {...it} />
              ))}
            </XStack>
          </YStack>
        </Card>

        {/* Bottom action */}
        <Button bg="$blueSecondary" br="$6" height={56} onPress={() => {}}>
          <Text fs={16} fw="$medium" color="$white" o={0.85}>
            Cleaning files
          </Text>
        </Button>
      </YStack>
    </ScrollView>
  );
}

function CleanCard({ icon: Icon, count, size, label }: CleanItem) {
  return (
    <Card
      bordered
      bg="$grayLight"
      br="$9"
      p="$4"
      width="46%"
      pressStyle={{ opacity: 0.9 }}
      onPress={() => {}}
    >
      <YStack gap="$3" f={1} justify="space-between">
        {/* Top row with icon and checkbox placeholder */}
        <XStack justify="space-between" items="center">
          <Icon size={24} color="$blueSecondary" />
          <Stack
            height={24}
            width={24}
            br="$2"
            bg="#ffffff33"
            o={0.25}
            bordered
          />
        </XStack>

        {/* Count and size */}
        <XStack gap="$1.5" items="baseline">
          <Text color="$blueSecondary" o={0.8} fs={20} fw="$semibold">
            {count}
          </Text>
          <Text color="$white" o={0.5} fs={16} fw="$regular">
            {size}
          </Text>
        </XStack>

        {/* Label */}
        <Text color="$white" fs={14} fw="$regular">
          {label}
        </Text>
      </YStack>
    </Card>
  );
}
