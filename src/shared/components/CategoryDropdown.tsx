import { Image } from "expo-image";
import { useCallback, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Text, XStack, YStack, styled } from "tamagui";

import { BlurView } from "expo-blur";

export type CategoryOption = {
  id: string;
  label: string;
  count: number;
};

type CategoryDropdownProps = {
  categories: CategoryOption[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
};

export const FullscreenBlur = styled(BlurView, {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  overflow: "hidden",
});

export function CategoryDropdown({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory =
    categories.find((cat) => cat.id === selectedCategoryId) || categories[0];

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (categoryId: string) => {
      if (categoryId !== selectedCategoryId) {
        onSelectCategory(categoryId);
      }
      setIsOpen(false);
    },
    [selectedCategoryId, onSelectCategory]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Dropdown Button */}
      <XStack
        bg="$darkBlueAlpha30"
        px="$4"
        py="$3.5"
        br="$6"
        items="center"
        justify="space-between"
        width="100%"
        onPress={handleToggle}
      >
        <Text fs={16} fw="$regular" color="$white">
          {selectedCategory.label}
        </Text>
        <XStack gap="$3.5" items="center">
          <Text fs={16} fw="$medium" color="$blueTertiary">
            {selectedCategory.count.toLocaleString()}
          </Text>
          <Image
            source={require("@/assets/images/dropdown.svg")}
            style={{
              width: 24,
              height: 24,
            }}
            contentFit="contain"
          />
        </XStack>
      </XStack>

      {/* Modal with Blurred Background */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={{ flex: 1 }}>
          {/* BACKGROUND BLUR + dark overlay + close on tap */}
          <FullscreenBlur intensity={40} tint="dark">
            <Pressable
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
              onPress={handleClose}
            />
          </FullscreenBlur>
          <View
            style={{
              position: "absolute",
              top: 214,
              left: 15,
              right: 15,
            }}
            pointerEvents="box-none"
          >
            <YStack gap={4} pointerEvents="box-none">
              {categories.map((category) => (
                <XStack
                  bg="#272937"
                  px="$4"
                  py="$3.5"
                  br="$6"
                  items="center"
                  justify="space-between"
                  width="100%"
                  key={category.id}
                  onPress={() => handleSelect(category.id)}
                >
                  <Text fs={16} fw="$regular" color="$white">
                    {category.label}
                  </Text>
                  <XStack gap="$3.5" items="center">
                    <Text fs={16} fw="$medium" color="$blueTertiary">
                      {category.count.toLocaleString()}
                    </Text>
                    <Image
                      source={require("@/assets/images/dropdown.svg")}
                      style={{
                        width: 24,
                        height: 24,
                        transform: [{ rotate: "270deg" }],
                      }}
                      contentFit="contain"
                    />
                  </XStack>
                </XStack>
              ))}
            </YStack>
          </View>
        </View>
      </Modal>
    </>
  );
}
