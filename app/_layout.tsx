import "../tamagui-web.css";

import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { TamaguiProvider } from "tamagui";

import { initializeDatabase } from "@/src/shared/database/database";
import { userRepository } from "@/src/shared/database/repositories/UserRepository";
import { useUser } from "@/src/shared/hooks/useUser";
import { useUserStore } from "@/src/stores/useUserStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { navDark } from "../src/theme/navigation";
import { config } from "../tamagui.config";

export default function RootLayout() {
  const safeAreaBgColor = navDark.colors.background;
  const { loadUser } = useUser();

  useEffect(() => {
    initializeDatabase()
      .then(() => {
        console.log("Database initialized");
        return loadUser();
      })
      .then(async (loadedUser) => {
        // If no user loaded, create default user
        if (!loadedUser) {
          console.log("No user found, creating default user");
          const newUser = await userRepository.createUser({
            lastChangeSecretFolder: null,
            lastClean: null,
            lastSpeedTest: null,
            cleanedInTotal: 0,
            password: null,
          });
          // Update store with newly created user
          const { setUser } = useUserStore.getState();
          setUser(newUser);
        } else {
          console.log("User found:", loadedUser);
        }
      })
      .catch((error) => {
        console.error("Failed to initialize database or create user:", error);
      });
  }, [loadUser]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: safeAreaBgColor }}>
      <TamaguiProvider config={config} defaultTheme="cleaner">
        <ThemeProvider value={navDark}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: safeAreaBgColor },
            }}
          ></Stack>
        </ThemeProvider>
      </TamaguiProvider>
    </SafeAreaView>
  );
}
