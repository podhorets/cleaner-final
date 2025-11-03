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
    size: "126Gb",
    icon: Image,
  },
  {
    id: "dup-photos",
    label: "Duplicate photos",
    count: "4",
    size: "10.00Mb",
    icon: Copy,
  },
  {
    id: "blurry",
    label: "Blurry photos",
    count: "0",
    size: "10.00Mb",
    icon: Droplet,
  },
  {
    id: "dup-numbers",
    label: "Duplicate numbers",
    count: "0",
    size: "12.00Mb",
    icon: Users,
  },
];

export function SmartClean() {
  const router = useRouter();

  return (
    <ScrollView>
      <YStack gap="$4" p="$3">
        {/* Header */}
        <XStack ai="center" gap="$3">
          <Text
            onPress={() => router.back()}
            fs={16}
            fw="$medium"
            color="$scsSecondaryColor"
            o={0.7}
          >
            {"< Back"}
          </Text>
        </XStack>

        {/* Title and usage */}
        <YStack gap="$2" items="center" mt="$1">
          <Text color="$scsPrimaryColor" fs={28} fw="$bold">
            Smart Cleaner
          </Text>
          <Text color="$scsSecondaryColor" o={0.6} fs={12} fw="$medium">
            YOUR SYSTEM IS LOADED ON
          </Text>
          <Text color="$scsSecondaryColor" fs={44} fw="$bold">
            226.00
            <Text fs={18} fw="$regular">
              {" "}
              gb
            </Text>
          </Text>
          <Stack w="100%" mt="$2">
            <Progress value={76} br="$10" height={14}>
              <Progress.Indicator br="$10" bg="$scsPrimaryColor" />
            </Progress>
          </Stack>
          <XStack gap="$2" mt="$2" ai="center">
            <Text color="$scsSecondaryColor" o={0.6} fs={12} fw="$medium">
              LAST CLEARING
            </Text>
            <Text color="$scsSecondaryColor" fs={12} fw="$medium">
              2 NOV
            </Text>
          </XStack>
        </YStack>

        {/* Clean-up files */}
        <Card p="$4" br="$9" bg="#FFFFFF05">
          <YStack gap="$3">
            <YStack gap="$1">
              <Text color="$scsSecondaryColor" o={0.8} fs={12} fw="$medium">
                CLEAN-UP FILES
              </Text>
              <Text color="$scsSecondaryColor" o={0.6} fs={12} fw="$light">
                You can go to the section and see the files found.
              </Text>
            </YStack>

            <XStack gap="$3.5" flexWrap="wrap" jc="space-between">
              {items.map((it) => (
                <CleanCard key={it.id} {...it} />
              ))}
            </XStack>
          </YStack>
        </Card>

        {/* Bottom action */}
        <Button bg="$mainCardBg" br="$10" size="$5" onPress={() => {}}>
          <Text fs={16} fw="$medium" color="$scsSecondaryColor" o={0.85}>
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
      bg="$mainCardBg"
      br="$9"
      p="$4"
      w="48%"
      mb="$3"
      pressStyle={{ opacity: 0.9 }}
      onPress={() => {}}
    >
      <YStack gap="$2">
        {/* Top row with icon and checkbox placeholder */}
        <XStack jc="space-between" ai="center">
          <XStack height={30} width={30} br="$6" ai="center" jc="center">
            <Icon size={22} color="$scsPrimaryColor" />
          </XStack>
          <Stack height={18} width={18} br="$2" bg="$bg" o={0.25} bordered />
        </XStack>

        {/* Count and size */}
        <XStack gap="$1.5" ai="baseline">
          <Text color="$scsPrimaryColor" fs={20} fw="$bold">
            {count}
          </Text>
          <Text color="$scsSecondaryColor" o={0.6} fs={12} fw="$regular">
            ({size})
          </Text>
        </XStack>

        {/* Label */}
        <Text color="$scsSecondaryColor" fs={14} fw="$medium">
          {label}
        </Text>
      </YStack>
    </Card>
  );
}
