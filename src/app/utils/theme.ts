// Mapeo de tokens personalizados a tokens de Chakra UI
export const themeTokens = {
  // Background colors
  bg: {
    canvas: { light: "white", dark: "gray.900" },
    surface: { light: "gray.50", dark: "gray.800" },
    panel: { light: "white", dark: "gray.800" },
    muted: { light: "gray.100", dark: "gray.700" },
  },
  
  // Foreground colors
  fg: {
    default: { light: "gray.900", dark: "gray.100" },
    emphasized: { light: "gray.900", dark: "white" },
    muted: { light: "gray.600", dark: "gray.400" },
    error: { light: "red.600", dark: "red.400" },
  },
  
  // Border colors
  border: {
    subtle: { light: "gray.200", dark: "gray.700" },
  },
} as const;

// Helper function to get theme-aware color
export function getThemeColor(path: string, theme: 'light' | 'dark' = 'light') {
  const keys = path.split('.');
  let current: any = themeTokens;
  
  for (const key of keys) {
    current = current[key];
    if (!current) return path; // Return original if not found
  }
  
  return current[theme] || path;
}