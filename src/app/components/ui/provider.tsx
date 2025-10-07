import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";

interface UIProviderProps {
  children: React.ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );
}