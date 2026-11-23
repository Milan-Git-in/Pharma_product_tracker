/**
 * Design Tokens & Theme extracted from clinical_integrity/DESIGN.md
 * Clinical Integrity - Product Tracking System
 */

export const theme = {
  name: "Clinical Integrity",
  colors: {
    surface: "#f7f9fb",
    surfaceDim: "#d8dadc",
    surfaceBright: "#f7f9fb",
    surfaceContainerLowest: "#ffffff",
    surfaceContainerLow: "#f2f4f6",
    surfaceContainer: "#eceef0",
    surfaceContainerHigh: "#e6e8ea",
    surfaceContainerHighest: "#e0e3e5",
    onSurface: "#191c1e",
    onSurfaceVariant: "#40484d",
    inverseSurface: "#2d3133",
    inverseOnSurface: "#eff1f3",
    outline: "#70787d",
    outlineVariant: "#bfc8cd",
    surfaceTint: "#1b6681",
    primary: "#00465c",
    onPrimary: "#ffffff",
    primaryContainer: "#0f5f7a",
    onPrimaryContainer: "#96d7f6",
    inversePrimary: "#8fcfee",
    secondary: "#2d657c",
    onSecondary: "#ffffff",
    secondaryContainer: "#afe4ff",
    onSecondaryContainer: "#2f677e",
    tertiary: "#324257",
    onTertiary: "#ffffff",
    tertiaryContainer: "#49596f",
    onTertiaryContainer: "#bfd0ea",
    error: "#ba1a1a",
    onError: "#ffffff",
    errorContainer: "#ffdad6",
    onErrorContainer: "#93000a",
    primaryFixed: "#bee9ff",
    primaryFixedDim: "#8fcfee",
    onPrimaryFixed: "#001f2a",
    onPrimaryFixedVariant: "#004d65",
    secondaryFixed: "#bde9ff",
    secondaryFixedDim: "#98cee8",
    onSecondaryFixed: "#001f2a",
    onSecondaryFixedVariant: "#0a4d63",
    tertiaryFixed: "#d3e4fe",
    tertiaryFixedDim: "#b7c8e1",
    onTertiaryFixed: "#0b1c30",
    onTertiaryFixedVariant: "#38485d",
    background: "#f7f9fb",
    onBackground: "#191c1e",
    surfaceVariant: "#e0e3e5",

    // GMP Status & Compliance Tokens
    gmp: {
      compliant: "#10B981", // Released lots, passed bio-burden assays, verified cold-chain
      warning: "#F59E0B",   // 80%+ hold time limit, approaching limit
      critical: "#EF4444",  // Exceeded hold time, quarantined, failed
      inactive: "#64748B",  // Decommissioned, archived, closed
    },
  },

  typography: {
    headlineXl: {
      fontFamily: "Inter, sans-serif",
      fontSize: "32px",
      fontWeight: "600",
      lineHeight: "40px",
      letterSpacing: "-0.02em",
    },
    headlineXlMobile: {
      fontFamily: "Inter, sans-serif",
      fontSize: "24px",
      fontWeight: "600",
      lineHeight: "32px",
      letterSpacing: "-0.01em",
    },
    headlineLg: {
      fontFamily: "Inter, sans-serif",
      fontSize: "24px",
      fontWeight: "600",
      lineHeight: "32px",
      letterSpacing: "-0.015em",
    },
    headlineMd: {
      fontFamily: "Inter, sans-serif",
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "28px",
      letterSpacing: "-0.01em",
    },
    headlineSm: {
      fontFamily: "Inter, sans-serif",
      fontSize: "16px",
      fontWeight: "600",
      lineHeight: "24px",
      letterSpacing: "-0.005em",
    },
    bodyLg: {
      fontFamily: "Inter, sans-serif",
      fontSize: "15px",
      fontWeight: "400",
      lineHeight: "22px",
    },
    bodyMd: {
      fontFamily: "Inter, sans-serif",
      fontSize: "13px",
      fontWeight: "400",
      lineHeight: "20px",
    },
    bodySm: {
      fontFamily: "Inter, sans-serif",
      fontSize: "12px",
      fontWeight: "400",
      lineHeight: "18px",
    },
    labelLg: {
      fontFamily: "JetBrains Mono, monospace",
      fontSize: "13px",
      fontWeight: "500",
      lineHeight: "18px",
      letterSpacing: "0.02em",
    },
    labelMd: {
      fontFamily: "JetBrains Mono, monospace",
      fontSize: "12px",
      fontWeight: "500",
      lineHeight: "16px",
      letterSpacing: "0.02em",
    },
    labelSm: {
      fontFamily: "JetBrains Mono, monospace",
      fontSize: "11px",
      fontWeight: "500",
      lineHeight: "14px",
      letterSpacing: "0.03em",
    },
    caption: {
      fontFamily: "Inter, sans-serif",
      fontSize: "11px",
      fontWeight: "500",
      lineHeight: "16px",
      letterSpacing: "0.01em",
    },
  },

  rounded: {
    sm: "0.25rem",
    DEFAULT: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },

  spacing: {
    gutter: "1rem",
    gutterSm: "0.5rem",
    gutterLg: "1.5rem",
    margin: "1.5rem",
    marginSm: "1rem",
    marginLg: "2rem",
    spaceXs: "0.25rem",
    spaceSm: "0.5rem",
    spaceMd: "1rem",
    spaceLg: "1.5rem",
    spaceXl: "2rem",
  },

  elevation: {
    level1: "0px 1px 2px 0px rgba(15, 23, 42, 0.05)",
    level2: "0px 2px 4px -1px rgba(15, 23, 42, 0.06), 0px 1px 2px 0px rgba(15, 23, 42, 0.04)",
    level3: "0px 4px 12px -2px rgba(15, 23, 42, 0.06), 0px 1px 3px 0px rgba(15, 23, 42, 0.04)",
  },

  touchTargets: {
    minSize: "44px",
  },
} as const;

export default theme;

