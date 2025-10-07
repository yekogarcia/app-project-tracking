import { IconButton } from "@chakra-ui/react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline" | "solid";
}

export function ThemeToggle({ size = "md", variant = "ghost" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <IconButton
        aria-label="Toggle theme"
        size={size}
        variant={variant}
      >
        <FiSun />
      </IconButton>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <IconButton
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      size={size}
      variant={variant}
    >
      {theme === "dark" ? <FiSun /> : <FiMoon />}
    </IconButton>
  );
}