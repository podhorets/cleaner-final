import "../tamagui-web.css";

import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { TamaguiProvider } from "tamagui";

import { initializeDatabase } from "@/src/shared/database/database";
import { userRepository } from "@/src/shared/database/repositories/UserRepository";
import { SafeAreaView } from "react-native-safe-area-context";
import { navDark } from "../src/theme/navigation";
import { config } from "../tamagui.config";

export default function RootLayout() {
  const safeAreaBgColor = navDark.colors.background;

  useEffect(() => {
    initializeDatabase()
      .then(() => {
        console.log("Database initialized");
        return userRepository.getUser();
      })
      .then((user) => {
        if (!user) {
          console.log("No user found, creating default user");
          return userRepository.createUser({
            lastChangeSecretFolder: null,
            lastClean: null,
            lastSpeedTest: null,
            cleanedInTotal: 0,
            password: null,
          });
        }
        console.log("User found:", user);
        return user;
      })
      .catch((error) => {
        console.error("Failed to initialize database or create user:", error);
      });
  }, []);

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
