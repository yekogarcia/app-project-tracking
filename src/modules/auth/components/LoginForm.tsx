import { useState, useEffect } from 'react';
import {
  VStack,
  Button,
  Input,
  Text,
  Link,
  Alert,
  Field,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { LoginCredentials } from '../types';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<Partial<LoginCredentials>>({});

  // Redirect to admin dashboard after successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const errors: Partial<LoginCredentials> = {};
    
    if (!credentials.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = 'El email no es válido';
    }
    
    if (!credentials.password) {
      errors.password = 'La contraseña es requerida';
    } else if (credentials.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    console.log('Formulario enviado con credenciales:', credentials);
    
    if (!validateForm()) {
      console.log('Validación falló');
      return;
    }
    
    console.log('Iniciando login...');
    await login(credentials);
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={4} align="stretch">
        {error && (
          <Alert.Root status="error" borderRadius="md">
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}
        
        <Field.Root invalid={!!validationErrors.email}>
          <Field.Label>Email</Field.Label>
          <Input
            type="email"
            value={credentials.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="tu@email.com"
            size={{ base: 'md', md: 'lg' }}
          />
          {validationErrors.email && (
            <Field.ErrorText>{validationErrors.email}</Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!validationErrors.password}>
          <Field.Label>Contraseña</Field.Label>
          <Input
            type="password"
            value={credentials.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="••••••••"
            size={{ base: 'md', md: 'lg' }}
          />
          {validationErrors.password && (
            <Field.ErrorText>{validationErrors.password}</Field.ErrorText>
          )}
        </Field.Root>

        <Button
          type="submit"
          colorScheme="blue"
          size={{ base: 'md', md: 'lg' }}
          loading={isLoading}
          loadingText="Iniciando sesión..."
          w="full"
        >
          Iniciar Sesión
        </Button>

        <Text textAlign="center" fontSize="sm" color="gray.600">
          ¿No tienes cuenta?{' '}
          <Link
            color="blue.500"
            onClick={onSwitchToRegister}
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
          >
            Regístrate aquí
          </Link>
        </Text>

        <Text textAlign="center" fontSize="xs" color="gray.500" mt={2}>
          Demo: admin@example.com / admin123
        </Text>
      </VStack>
    </form>
  );
}