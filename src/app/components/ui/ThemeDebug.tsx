import { Box, Text, HStack, Badge } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeDebug() {
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Box
      position="fixed"
      bottom="4"
      right="4"
      bg="bg.panel"
      borderRadius="md"
      borderWidth="1px"
      borderColor="border.subtle"
      p="3"
      fontSize="xs"
      zIndex="tooltip"
      display={{ base: "none", md: "block" }}
    >
      <Text fontWeight="bold" mb="1">Theme Debug</Text>
      <HStack gap="2" flexWrap="wrap">
        <Badge variant="outline">Theme: {theme}</Badge>
        <Badge variant="outline">Resolved: {resolvedTheme}</Badge>
        <Badge variant="outline">System: {systemTheme}</Badge>
      </HStack>
    </Box>
  );
}