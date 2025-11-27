import { baseColors } from "./base";

const defaultFonts = {
  regular: { fontFamily: "System", fontWeight: "400" as const },
  medium: { fontFamily: "System", fontWeight: "500" as const },
  bold: { fontFamily: "System", fontWeight: "700" as const },
  heavy: { fontFamily: "System", fontWeight: "900" as const },
};

export const navDark = {
  dark: true,
  colors: {
    primary: baseColors.bluePrimary,
    background: baseColors.darkBg,
    card: baseColors.darkBgAlt,
    text: baseColors.white,
    border: baseColors.darkBlueAlpha30,
    notification: baseColors.redPrimary,
  },
  fonts: defaultFonts,
};
