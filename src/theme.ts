import { Dimensions } from "react-native";

/**
 * A warm, calm, high-contrast theme designed to be easy on older eyes:
 * large type, generous spacing, big touch targets.
 */
export const colors = {
  bg: "#F4F1EA",
  card: "#FFFFFF",
  primary: "#0E7C66",
  primaryDark: "#0A5D4D",
  accent: "#E8A13A",
  text: "#1E2A2A",
  textSoft: "#5C6B6B",
  border: "#DCD7CC",
  correct: "#1F8A4C",
  correctBg: "#E3F4E8",
  wrong: "#C0392B",
  wrongBg: "#FBE7E4",
  neutralBtn: "#E9E5DB",
  white: "#FFFFFF",
};

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };

export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 36 };

/** Tablets / desktops get larger type and a centered content column. */
export function isLargeScreen(): boolean {
  return Dimensions.get("window").width >= 700;
}

export function scaledFont(base: number): number {
  return isLargeScreen() ? Math.round(base * 1.2) : base;
}

export const font = {
  get title() {
    return scaledFont(30);
  },
  get heading() {
    return scaledFont(24);
  },
  get body() {
    return scaledFont(19);
  },
  get big() {
    return scaledFont(26);
  },
  get label() {
    return scaledFont(16);
  },
};
