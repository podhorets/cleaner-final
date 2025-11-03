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
    background: baseColors.light.bg,
    card: baseColors.light.cardBg,
    text: baseColors.light.text,
    border: baseColors.light.cardBg,
    primary: baseColors.light.smartCleanerBg,
    notification: baseColors.light.secretFolderBg,
  },
  fonts: defaultFonts,
};

export const navDark = {
  dark: true,
  colors: {
    background: baseColors.dark.bg,
    card: baseColors.dark.cardBg,
    text: baseColors.dark.text,
    border: baseColors.dark.cardBg,
    primary: baseColors.dark.smartCleanerBg,
    notification: baseColors.dark.secretFolderBg,
  },
  fonts: defaultFonts,
};
