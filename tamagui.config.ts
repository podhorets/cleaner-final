import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";
import { baseColors } from "./src/theme/base";

// generate our theme objects from base colors
const themes = {
  light: {
    bg: baseColors.light.bg,
    cardBg: baseColors.light.cardBg,
    smartCleanerBg: baseColors.light.smartCleanerBg,
    secretFolderBg: baseColors.light.secretFolderBg,
    menuBg: baseColors.light.menuBg,
    text: baseColors.light.text,
  },
  dark: {
    bg: baseColors.dark.bg,
    cardBg: baseColors.dark.cardBg,
    smartCleanerBg: baseColors.dark.smartCleanerBg,
    secretFolderBg: baseColors.dark.secretFolderBg,
    menuBg: baseColors.dark.menuBg,
    text: baseColors.dark.text,
  },
};

export const config = createTamagui({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
  },
  themes: {
    ...defaultConfig.themes,
    ...themes,
  },
  shorthands: {
    ...defaultConfig.shorthands,
    br: "borderRadius",
  },
  fonts: {
    ...defaultConfig.fonts,
    heading: {
      ...defaultConfig.fonts?.heading,
    },
    body: {
      ...defaultConfig.fonts?.body,
      weight: {
        ...defaultConfig.fonts?.body?.weight,
        light: "300",
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
    },
  },
});
