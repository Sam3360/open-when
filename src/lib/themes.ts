import type { CSSProperties } from "react";

export type ThemeKey =
  | "lavender"
  | "peach"
  | "rose"
  | "midnight"
  | "classic"
  | "cream";

export type BoxTheme = {
  key: ThemeKey;
  label: string;
  blurb: string;
  cover: {
    bg: string;
    ink: string;
    soft: string;
    accent: string;
    line: string;
    stampBg: string;
    stampInk: string;
  };
  envelope: {
    paper: string;
    flap: string;
    line: string;
    seal: string;
  };
};

export const THEMES: Record<ThemeKey, BoxTheme> = {
  lavender: {
    key: "lavender",
    label: "Soft lavender",
    blurb: "Dusty, quiet, a little dreamy.",
    cover: {
      bg: "#e7e0ea",
      ink: "#35303d",
      soft: "#6a6175",
      accent: "#7d6f8b",
      line: "#cfc4d5",
      stampBg: "#efe8f1",
      stampInk: "#7d6f8b",
    },
    envelope: {
      paper: "#f7f3f8",
      flap: "#e3d9e8",
      line: "#d6c9db",
      seal: "#877a95",
    },
  },
  peach: {
    key: "peach",
    label: "Warm peach",
    blurb: "Sun through a window.",
    cover: {
      bg: "#f4e6d8",
      ink: "#43352b",
      soft: "#7b6656",
      accent: "#a87b5d",
      line: "#e0cbb8",
      stampBg: "#fbefe3",
      stampInk: "#a87b5d",
    },
    envelope: {
      paper: "#fcf7f1",
      flap: "#f0ddca",
      line: "#e4d3c1",
      seal: "#b4825f",
    },
  },
  rose: {
    key: "rose",
    label: "Rose garden",
    blurb: "Pressed petals, soft edges.",
    cover: {
      bg: "#f2e3e1",
      ink: "#42302f",
      soft: "#7c6563",
      accent: "#9d6f6c",
      line: "#ddc7c4",
      stampBg: "#fbeeec",
      stampInk: "#9d6f6c",
    },
    envelope: {
      paper: "#fcf6f4",
      flap: "#ecd7d4",
      line: "#e0cdca",
      seal: "#a87470",
    },
  },
  midnight: {
    key: "midnight",
    label: "Midnight letters",
    blurb: "For reading late at night.",
    cover: {
      bg: "#2c2d34",
      ink: "#f2eee4",
      soft: "#bdb8ab",
      accent: "#cdbfa9",
      line: "#4a4b54",
      stampBg: "#363740",
      stampInk: "#d6c7ae",
    },
    envelope: {
      paper: "#f6f2e8",
      flap: "#e9e2d2",
      line: "#d6cebc",
      seal: "#9f9384",
    },
  },
  classic: {
    key: "classic",
    label: "Classic paper",
    blurb: "Notebook pages and good ink.",
    cover: {
      bg: "#f6f1e4",
      ink: "#33302a",
      soft: "#756e5e",
      accent: "#8c7a55",
      line: "#ded4bd",
      stampBg: "#fbf6e9",
      stampInk: "#8c7a55",
    },
    envelope: {
      paper: "#fbf8ef",
      flap: "#efe7d4",
      line: "#ded4bd",
      seal: "#9a8660",
    },
  },
  cream: {
    key: "cream",
    label: "Minimal cream",
    blurb: "Barely there, all warmth.",
    cover: {
      bg: "#faf7f1",
      ink: "#2e2b26",
      soft: "#756f64",
      accent: "#8a8274",
      line: "#e2dccd",
      stampBg: "#fdfaf4",
      stampInk: "#8a8274",
    },
    envelope: {
      paper: "#fdfbf6",
      flap: "#f1ece1",
      line: "#e4ddce",
      seal: "#a39b8c",
    },
  },
};

export const THEME_LIST: BoxTheme[] = Object.values(THEMES);

export function isThemeKey(value: unknown): value is ThemeKey {
  return typeof value === "string" && value in THEMES;
}

/** CSS custom properties that drive an envelope or cover in a given theme. */
export function themeVars(theme: BoxTheme): CSSProperties {
  return {
    "--env-paper": theme.envelope.paper,
    "--env-flap": theme.envelope.flap,
    "--env-line": theme.envelope.line,
    "--env-seal": theme.envelope.seal,
    "--cover-bg": theme.cover.bg,
    "--cover-ink": theme.cover.ink,
    "--cover-soft": theme.cover.soft,
    "--cover-accent": theme.cover.accent,
    "--cover-line": theme.cover.line,
    "--stamp-bg": theme.cover.stampBg,
    "--stamp-ink": theme.cover.stampInk,
    "--stamp-line": theme.cover.accent,
  } as CSSProperties;
}
