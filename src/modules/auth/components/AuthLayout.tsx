import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { ThemeToggle } from "../../../app/components/ui/ThemeToggle";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <Box
      minH="100vh"
      bg={{ base: "gray.50", _dark: "gray.900" }}
      position="relative"
    >
      <Box position="absolute" top="4" right="4" zIndex="10">
        <ThemeToggle size="md" />
      </Box>

      <Flex
        minH="100vh"
        alignItems="center"
        justifyContent="center"
        px={{ base: 4, md: 8 }}
      >
        <Container maxW="100%" py={8}>
          <VStack gap={8} align="stretch">
            <VStack gap={2} textAlign="center">
              <Heading
                size={{ base: "lg", md: "xl" }}
                color={{ base: "gray.900", _dark: "white" }}
              >
                {title}
              </Heading>
              {subtitle && (
                <Text
                  color={{ base: "gray.600", _dark: "gray.400" }}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {subtitle}
                </Text>
              )}
            </VStack>

            <Box
              bg={{ base: "white", _dark: "gray.800" }}
              p={{ base: 6, md: 8 }}
              borderRadius="lg"
              boxShadow="lg"
              border="1px"
              borderColor={{ base: "gray.200", _dark: "gray.700" }}
              width="fit-content"
              mx="auto"
            >
              {children}
            </Box>
          </VStack>
        </Container>
      </Flex>
    </Box>
  );
}
