export const theme = {
  colors: {
    background: "#061827",
    backgroundElevated: "#0A2238",
    backgroundGradient: "#0D4A67",

    card: "rgba(255,255,255,0.10)",
    cardStrong: "rgba(255,255,255,0.14)",
    cardSoft: "rgba(255,255,255,0.065)",

    primary: "#20CEC6",
    primarySoft: "rgba(32,206,198,0.14)",

    secondary: "#F6D990",
    secondarySoft: "rgba(246,217,144,0.14)",

    info: "#74D7FF",
    success: "#43D6A5",
    warning: "#FFBE72",
    danger: "#FF9B9B",

    text: "#F8FCFF",
    textSoft: "rgba(235,246,255,0.78)",
    textMuted: "rgba(235,246,255,0.56)",

    border: "rgba(255,255,255,0.10)",
    borderStrong: "rgba(255,255,255,0.16)",
    overlay: "rgba(3,14,25,0.72)",
  },

  radius: {
    xl: 28,
    lg: 22,
    md: 16,
    sm: 11,
    pill: 999,
  },

  spacing: {
    xs: 6,
    sm: 10,
    md: 18,
    lg: 28,
    xl: 40,
  },

  typography: {
    eyebrow: 11,
    caption: 12,
    body: 14,
    bodyLarge: 15,
    title: 22,
    display: 34,
  },

  shadows: {
    soft: "0 10px 28px rgba(0,0,0,0.14)",
    card: "0 16px 38px rgba(0,0,0,0.20)",
    floating: "0 22px 58px rgba(0,0,0,0.42)",
  },

  motion: {
    fast: "150ms ease",
    normal: "190ms cubic-bezier(0.22,1,0.36,1)",
  },
} as const;