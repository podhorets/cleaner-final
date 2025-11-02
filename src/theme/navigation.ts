import { baseColors } from "./base";

const defaultFonts = {
  regular: { fontFamily: "System", fontWeight: "400" as const },
  medium: { fontFamily: "System", fontWeight: "500" as const },
  bold: { fontFamily: "System", fontWeight: "700" as const },
  heavy: { fontFamily: "System", fontWeight: "900" as const },
};

export const navLight = {
  dark: false,
  colors: {
    background: baseColors.light.background,
    card: baseColors.light.surface,
    text: baseColors.light.text,
    border: baseColors.light.border,
    primary: baseColors.light.primary,
    notification: baseColors.light.danger,
  },
  fonts: defaultFonts,
};

export const navDark = {
  dark: true,
  colors: {
    background: baseColors.dark.bg,
    card: baseColors.dark.surface,
    text: baseColors.dark.text,
    border: baseColors.dark.border,
    primary: baseColors.dark.primary,
    notification: baseColors.dark.danger,
  },
  fonts: defaultFonts,
};
