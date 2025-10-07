import { Box, Text, HStack, Badge } from "@chakra-ui/react";
import { useBreakpoint } from "../../hooks/useBreakpoint";

export function BreakpointDebug() {
  const { isMobile, isTablet, isDesktop, currentBreakpoint } = useBreakpoint();

  return (
    <Box
      position="fixed"
      bottom="4"
      left="4"
      bg="bg.panel"
      borderRadius="md"
      borderWidth="1px"
      borderColor="border.subtle"
      p="3"
      fontSize="xs"
      zIndex="tooltip"
      display={{ base: "none", md: "block" }}
    >
      <Text fontWeight="bold" mb="1">Breakpoint Debug</Text>
      <HStack gap="2" flexWrap="wrap">
        <Badge variant={isMobile ? "solid" : "outline"} colorScheme="blue">
          Mobile: {isMobile ? "✓" : "✗"}
        </Badge>
        <Badge variant={isTablet ? "solid" : "outline"} colorScheme="green">
          Tablet: {isTablet ? "✓" : "✗"}
        </Badge>
        <Badge variant={isDesktop ? "solid" : "outline"} colorScheme="purple">
          Desktop: {isDesktop ? "✓" : "✗"}
        </Badge>
      </HStack>
      <Text mt="1" color="fg.muted">
        Current: {currentBreakpoint}
      </Text>
    </Box>
  );
}