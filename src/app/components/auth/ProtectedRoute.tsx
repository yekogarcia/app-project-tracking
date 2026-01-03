import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
// import { Box, Spinner, VStack } from '@chakra-ui/react';
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { Box, Spinner, VStack } from "@chakra-ui/react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "ADMIN" | "USER"; // 🎯 Coincidir con el store
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const {
    isAuthenticated,
    isLoading,
    account,
  } = useAuthStore();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={{ base: "gray.50", _dark: "gray.900" }}
      >
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
        </VStack>
      </Box>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated || account.id === 0) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requiredRole && account?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
