// Design System Constants
export const DESIGN_SYSTEM = {
  // Spacing
  spacing: {
    xs: "0.5rem",    // 8px
    sm: "0.75rem",   // 12px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    "2xl": "3rem",   // 48px
    "3xl": "4rem",   // 64px
  },

  // Border Radius
  radius: {
    sm: "0.375rem",  // 6px
    md: "0.5rem",    // 8px
    lg: "0.75rem",   // 12px
    xl: "1rem",      // 16px
    full: "9999px",  // full
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  // Typography
  typography: {
    sizes: {
      xs: "0.75rem",   // 12px
      sm: "0.875rem",  // 14px
      base: "1rem",    // 16px
      lg: "1.125rem",  // 18px
      xl: "1.25rem",   // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem",  // 36px
    },
    weights: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  // Colors
  colors: {
    primary: {
      50: "#fef2f2",
      100: "#fee2e2", 
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
    },
    gradient: {
      primary: "from-rose-400 via-orange-400 to-yellow-400",
      primaryHover: "from-rose-500 via-orange-500 to-yellow-500",
    },
    google: {
      blue: "#4285F4",
      green: "#34A853",
      yellow: "#FBBC05",
      red: "#EA4335",
    },
  },

  // Component Heights
  heights: {
    button: {
      xs: "1.75rem",   // 28px
      sm: "2rem",      // 32px
      md: "2.5rem",    // 40px
      lg: "3rem",      // 48px
      xl: "3.5rem",    // 56px
    },
    input: {
      sm: "2rem",      // 32px
      md: "2.5rem",    // 40px
      lg: "3rem",      // 48px
    },
  },
} as const

// Helper functions
export const getSpacing = (size: keyof typeof DESIGN_SYSTEM.spacing) => DESIGN_SYSTEM.spacing[size]
export const getRadius = (size: keyof typeof DESIGN_SYSTEM.radius) => DESIGN_SYSTEM.radius[size]
export const getShadow = (size: keyof typeof DESIGN_SYSTEM.shadows) => DESIGN_SYSTEM.shadows[size]