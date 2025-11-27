import "../tamagui-web.css";

import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";

import { SafeAreaView } from "react-native-safe-area-context";
import { navDark } from "../src/theme/navigation";
import { config } from "../tamagui.config";

export default function RootLayout() {
  const safeAreaBgColor = navDark.colors.background;

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
