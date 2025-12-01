import { useCallback, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Stack, Text, XStack, YStack } from "tamagui";

export type CategoryOption = {
  id: string;
  label: string;
  count: number;
  route: string;
};

type CategoryDropdownProps = {
  categories: CategoryOption[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
};

export function CategoryDropdown({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId) || categories[0];

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

  return (
    <>
      {/* Dropdown Button */}
      <Pressable onPress={handleToggle}>
        <XStack
          bg="rgba(66,72,101,0.3)"
          h={60}
          px="$3.75"
          py="$2.5"
          br="$4"
          items="center"
          justify="space-between"
        >
          <XStack gap="$3" items="center" flex={1}>
            <YStack gap="$1">
              <Text fs={16} fw="$regular" color="$white">
                {selectedCategory.label}
              </Text>
            </YStack>
          </XStack>
          <XStack gap="$3.75" items="center">
            <Text fs={16} fw="$medium" color="#0385ff">
              {selectedCategory.count.toLocaleString()}
            </Text>
            <Stack
              bg="#0385ff"
              borderWidth={2}
              borderColor="#0385ff"
              br="$2"
              width={24}
              height={24}
              items="center"
              justify="center"
              style={{
                transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
              }}
            >
              <Image
                source={require("@/assets/images/arrow_right.svg")}
                style={{ width: 12, height: 12, transform: [{ rotate: "-90deg" }] }}
                contentFit="contain"
              />
            </Stack>
          </XStack>
        </XStack>
      </Pressable>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsOpen(false)}
          >
            <Stack
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="rgba(0,0,0,0.4)"
            />
          </Pressable>
          <YStack
            position="absolute"
            top={114}
            left={15}
            right={15}
            gap={4}
            zIndex={1000}
          >
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => handleSelect(category.id)}
              >
                <XStack
                  bg="#272937"
                  h={60}
                  px="$3.75"
                  py="$2.5"
                  br="$4"
                  items="center"
                  justify="space-between"
                >
                  <XStack gap="$3" items="center" flex={1}>
                    <YStack gap="$1">
                      <Text
                        fs={16}
                        fw={category.id === selectedCategoryId ? "$medium" : "$regular"}
                        color="$white"
                      >
                        {category.label}
                      </Text>
                    </YStack>
                  </XStack>
                  <XStack gap="$3.75" items="center">
                    <Text fs={16} fw="$medium" color="#0385ff">
                      {category.count.toLocaleString()}
                    </Text>
                    <Stack
                      bg="#0385ff"
                      borderWidth={2}
                      borderColor="#0385ff"
                      br="$2"
                      width={24}
                      height={24}
                      items="center"
                      justify="center"
                    >
                      <Image
                        source={require("@/assets/images/arrow_right.svg")}
                        style={{ width: 12, height: 12, transform: [{ rotate: "-90deg" }] }}
                        contentFit="contain"
                      />
                    </Stack>
                  </XStack>
                </XStack>
              </Pressable>
            ))}
          </YStack>
        </>
      )}
    </>
  );
}

