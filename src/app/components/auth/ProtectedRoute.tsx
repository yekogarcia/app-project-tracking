import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../modules/auth/context/AuthContext';
import { Box, Spinner, VStack } from '@chakra-ui/react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={{ base: 'gray.50', _dark: 'gray.900' }}
      >
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
        </VStack>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}