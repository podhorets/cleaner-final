import "../tamagui-web.css";

import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";

import { SafeAreaView } from "react-native-safe-area-context";
import { navDark, navLight } from "../src/theme/navigation";
import { config } from "../tamagui.config";

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "dark";

  // const safeAreaBgColor =
  //   colorScheme === "dark"
  //     ? navDark.colors.background
  //     : navLight.colors.background;
  const safeAreaBgColor = navDark.colors.background;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: safeAreaBgColor }}>
      <TamaguiProvider
        config={config}
        // defaultTheme={colorScheme === "dark" ? "dark" : "light"}
        defaultTheme={"dark"}
      >
        <ThemeProvider value={colorScheme === "dark" ? navDark : navLight}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            <Stack.Screen name="dark" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </TamaguiProvider>
    </SafeAreaView>
  );
}
