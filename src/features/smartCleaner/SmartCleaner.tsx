import ArrowRight from "@/assets/images/arrow_right.svg";
import BlurryPhotos from "@/assets/images/blurry_photos.svg";
import Checked from "@/assets/images/checked_checkbox.svg";
import DuplicateContacts from "@/assets/images/duplicate_contacts.svg";
import Screenshots from "@/assets/images/screenshots.svg";
import Selfie from "@/assets/images/selfie.svg";
import SimilarPhotos from "@/assets/images/similar_photos.svg";
import Unchecked from "@/assets/images/unchecked_checkbox.svg";
import { Image, ImageSource } from "expo-image";
import { Button, Card, ScrollView, Stack, Text, XStack, YStack } from "tamagui";

import { LoadingSpinner } from "@/src/shared/components/LoadingSpinner";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { SmartCleanProgressBar } from "@/src/shared/components/SmartCleanProgressBar";
import { useUser } from "@/src/shared/hooks/useUser";
import { PhotoCategory } from "@/src/shared/types/categories";
import { useSmartCleanerStore } from "@/src/stores/useSmartCleanerStore";
import { useUserStore } from "@/src/stores/useUserStore";
import { router } from "expo-router";
import { useEffect } from "react";

type CleanItem = {
  id: PhotoCategory;
  label: string;
  count: number;
  size: string;
  icon: ImageSource;
  checked: boolean;
};

const CLEAN_ITEMS: readonly CleanItem[] = [
  {
    id: PhotoCategory.SIMILAR_PHOTOS,
    label: "Similar photos",
    count: 0,
    size: "12.00Mb",
    icon: SimilarPhotos,
    checked: true,
  },
  {
    id: PhotoCategory.SCREENSHOTS,
    label: "Screenshots",
    count: 0,
    size: "12.00Mb",
    icon: Screenshots,
    checked: false,
  },
  {
    id: PhotoCategory.LONG_VIDEOS,
    label: "Long videos",
    count: 0,
    size: "12.00Mb",
    icon: BlurryPhotos,
    checked: true,
  },
  {
    id: PhotoCategory.SELFIES,
    label: "Selfie",
    count: 0,
    size: "12.00Mb",
    icon: Selfie,
    checked: false,
  },
  {
    id: PhotoCategory.DUPLICATE_CONTACTS,
    label: "Duplicate contacts",
    count: 0,
    size: "12.00Mb",
    icon: DuplicateContacts,
    checked: false,
  },
  // {
  //   id: "internet-speed",
  //   label: "Internet speed",
  //   count: 0,
  //   size: "0Mb",
  //   icon: BlurryPhotos,
  //   checked: false,
  // },
] as const;

export function SmartCleaner() {
  const { updateField } = useUser();
  const { user } = useUserStore();

  // Use new SmartCleaner store
  const getCount = useSmartCleanerStore((state) => state.getCount);
  const isLoading = useSmartCleanerStore((state) => state.isLoading);
  const getAllIdsToDelete = useSmartCleanerStore(
    (state) => state.getAllIdsToDelete
  );
  const fetchAllResources = useSmartCleanerStore(
    (state) => state.fetchAllResources
  );
  const resources = useSmartCleanerStore((state) => state.resources);
  const refetchAll = useSmartCleanerStore((state) => state.refetchAll);
  const clearSelections = useSmartCleanerStore(
    (state) => state.clearSelections
  );
  
  // Subscribe to manualSelections to trigger re-renders when user selects photos
  const manualSelections = useSmartCleanerStore((state) => state.manualSelections);

  // Load all resources on component mount
  useEffect(() => {
    if (isLoading) {
      console.log("isLoading", isLoading);
      return;
    }
    const anyResourcesNull = Object.values(resources).some(
      (resource) => resource === null
    );
    if (!isLoading && anyResourcesNull) {
      fetchAllResources();
      console.log("Fetching all resources");
    } else {
      console.log("All resources are loaded");
    }
  }, [fetchAllResources, resources, isLoading]);

  // Map store counts to clean items using getCount interface
  const cleanItemsWithCounts: CleanItem[] = CLEAN_ITEMS.map((item) => {
    // TODO: rethink if this is valid
    // const count = getCount(item.id as PhotoCategory);
    // return { ...item, count };
      const count = manualSelections[item.id]?.length > 0 
    ? manualSelections[item.id].length 
    : (resources[item.id]?.length ?? 0);
  return { ...item, count };
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen size={50} />;
  }
  return (
    <ScrollView>
      {/* Header */}
      <ScreenHeader title="Smart Cleaner" />
      <YStack gap="$4" px="$3.5">
        {/* Smart Clean Card */}
        <Card bg="$darkBlueAlpha30" br="$6" p="$3.5">
          <YStack gap="$4">
            {/* Last Clean Date */}
            <YStack bg="$whiteAlpha13" br="$6" p="$3" gap="$2.5">
              <Text fs={14} fw="$regular" color="$white">
                Last clean: 16 apr{" "}
                {user?.lastClean
                  ? new Date(user?.lastClean).toLocaleDateString()
                  : ""}
              </Text>

              {/* Progress Bar */}
              <SmartCleanProgressBar />
            </YStack>

            {/* Storage Info */}
            <XStack
              bg="$whiteAlpha13"
              br="$6"
              px="$3"
              py="$2"
              items="center"
              justify="space-between"
            >
              <Text
                fs={14}
                fw="$regular"
                color="$white"
                textTransform="uppercase"
              >
                storage load on
              </Text>
              <XStack gap="$1" items="flex-end">
                <Text fs={20} fw="$regular" color="$redPrimary">
                  238,2
                </Text>
                <Text fs={20} fw="$regular" color="$white">
                  GB
                </Text>
              </XStack>
            </XStack>
          </YStack>
        </Card>

        {/* Clean Items List */}
        <YStack gap="$2">
          {cleanItemsWithCounts.map((item) => (
            <Card
              key={item.id}
              bg="$darkBlueAlpha30"
              br="$6"
              py="$2.5"
              px="$3.5"
              // o={item.id === "similar-photos" ? 0.5 : 1}
            >
              <XStack items="center" justify="space-between">
                <XStack
                  gap="$3"
                  items="center"
                  flex={1}
                  onPress={() => {
                    if (item.id === PhotoCategory.DUPLICATE_CONTACTS) {
                      router.push("/contacts" as any);
                    } else {
                      router.push(
                        `/smart-cleaner-category?category=${item.id}` as any
                      );
                    }
                  }}
                >
                  {/* Icon */}
                  <Stack
                    bg="$whiteAlpha13"
                    br="$6"
                    width={43}
                    height={43}
                    items="center"
                    justify="center"
                  >
                    <Image
                      source={item.icon}
                      style={{ width: 21, height: 21 }}
                      contentFit="contain"
                    />
                  </Stack>

                  {/* Label and Size */}
                  <YStack gap="$1.5" flex={1}>
                    <XStack gap="$1.5" items="flex-end">
                      <Text fs={16} fw="$regular" color="$white">
                        {item.label}
                      </Text>
                      <Image
                        source={ArrowRight}
                        style={{ width: 18, height: 18 }}
                        contentFit="contain"
                      />
                    </XStack>
                    <Text fs={12} fw="$regular" color="$textSecondary">
                      {item.size}
                    </Text>
                  </YStack>
                </XStack>

                {/* Count and Checkbox */}
                <XStack gap="$3.5" items="center">
                  <Text fs={16} fw="$medium" color="$blueTertiary">
                    {item.count}
                  </Text>
                  <Image
                    source={item.checked ? Checked : Unchecked}
                    style={{ width: 24, height: 24 }}
                    contentFit="contain"
                  />
                </XStack>
              </XStack>
            </Card>
          ))}
        </YStack>

        {/* Bottom Button */}
        <Button
          bg="$blueTertiary"
          br="$9"
          height={55}
          onPress={async () => {
            // Get all IDs to delete using smart logic
            const idsToDelete = getAllIdsToDelete();
            if (idsToDelete.length > 0) {
              // TODO: Import and call deletePhotos when ready
              // const { deletePhotos } = await import("@/src/services/photo/deletePhotos");
              // const success = await deletePhotos(idsToDelete);
              // if (success) {
              //   clearSelections();
              //   refetchAll();
              //   updateField("lastClean", new Date().toISOString());
              // }
              // For now, just update last clean date
              console.log(`Would delete ${idsToDelete.length} photos`);
              updateField("lastClean", new Date().toISOString());
            }
          }}
        >
          <Text fs={17} fw="$semibold" color="$white">
            Cleaning files
          </Text>
        </Button>
      </YStack>
    </ScrollView>
  );
}
