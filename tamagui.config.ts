import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui, createTokens } from "tamagui";

const darkBackground = "#10121E";
const darkBackgroundHover = "#161C2E";
const darkBackgroundPress = "#0C101C";

const baseTokens = defaultConfig.tokens as unknown as {
  color: Record<string, string>;
};

const customTokens = createTokens({
  ...defaultConfig.tokens,
  color: {
    ...baseTokens.color,
    purple1: "#faf5ff",
    purple2: "#f3e8ff",
    purple3: "#e9d5ff",
    purple4: "#d8b4fe",
    purple5: "#c084fc",
    purple6: "#a855f7",
    purple7: "#9333ea",
    purple8: "#7e22ce",
    purple9: "#904BFF",
    purple10: "#6b21a8",
    purple11: "#581c87",
    purple12: "#3b0764",
    cleanerDarkBg: darkBackground,
  },
});

const baseTheme = defaultConfig.themes.light_blue;

const config = {
  ...defaultConfig,
  tokens: customTokens,
  themes: {
    ...defaultConfig.themes,
    purple: {
      ...baseTheme,
      background: "#904BFF",
      backgroundHover: "#7e22ce",
      backgroundPress: "#6b21a8",
      backgroundFocus: "#904BFF",
      color: "#ffffff",
      colorHover: "#ffffff",
      colorPress: "#ffffff",
      colorFocus: "#ffffff",
      borderColor: "#904BFF",
      borderColorHover: "#7e22ce",
      borderColorPress: "#6b21a8",
      borderColorFocus: "#904BFF",
    },
    dark: {
      ...defaultConfig.themes.dark,
      background: darkBackground,
      backgroundHover: darkBackgroundHover,
      backgroundPress: darkBackgroundPress,
      backgroundFocus: darkBackground,
      backgroundStrong: darkBackgroundHover,
    },
  },
};

export const tamaguiConfig = createTamagui(config);

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends Conf {}
}