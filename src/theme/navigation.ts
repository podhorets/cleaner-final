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
  },
  fonts: defaultFonts,
};

export const navDark = {
  dark: true,
  colors: {
    background: baseColors.dark.bg,
  },
  fonts: defaultFonts,
};
