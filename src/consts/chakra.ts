import { extendTheme, ThemeConfig } from "@chakra-ui/react";

export const chakraThemeConfig: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const chakraTheme = extendTheme({
  config: chakraThemeConfig,
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Space Grotesk', monospace",
  },
  styles: {
    global: (props: any) => ({
      body: {
        fontFamily: "'Inter', sans-serif",
        lineHeight: "1.6",
      },
      "*": {
        scrollBehavior: "smooth",
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "12px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        _hover: {
          transform: "translateY(-2px)",
          boxShadow: "lg",
        },
        _active: {
          transform: "translateY(0)",
        },
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === "dark" ? "purple.500" : "purple.600",
          color: "white",
          _hover: {
            bg: props.colorMode === "dark" ? "purple.400" : "purple.500",
            transform: "translateY(-2px)",
            boxShadow: "xl",
          },
        }),
        ghost: {
          _hover: {
            bg: "purple.50",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: "16px",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          _hover: {
            transform: "translateY(-4px)",
            boxShadow: "xl",
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: "700",
        lineHeight: "1.2",
      },
    },
  },
  colors: {
    purple: {
      50: "#f7f5ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95",
    },
  },
  shadows: {
    glow: "0 0 20px rgba(139, 92, 246, 0.3)",
    glowLg: "0 0 40px rgba(139, 92, 246, 0.4)",
  },
});
