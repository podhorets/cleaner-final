import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";
import { baseColors } from "./src/theme/base";

// generate our theme objects from base colors
const themes = {
  cleaner: {
    ...baseColors,
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
    fs: "fontSize",
    fw: "fontWeight",
    o: "opacity",
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
