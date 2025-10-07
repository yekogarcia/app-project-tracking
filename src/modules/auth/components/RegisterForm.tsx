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
import type { RegisterData } from '../types';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<Partial<RegisterData>>({});

  // Redirect to admin dashboard after successful registration
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const errors: Partial<RegisterData> = {};
    
    if (!formData.name) {
      errors.name = 'El nombre es requerido';
    } else if (formData.name.length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    await register(formData);
  };

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        
        <Field.Root invalid={!!validationErrors.name}>
          <Field.Label>Nombre completo</Field.Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Tu nombre completo"
            size={{ base: 'md', md: 'lg' }}
          />
          {validationErrors.name && (
            <Field.ErrorText>{validationErrors.name}</Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!validationErrors.email}>
          <Field.Label>Email</Field.Label>
          <Input
            type="email"
            value={formData.email}
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
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="••••••••"
            size={{ base: 'md', md: 'lg' }}
          />
          {validationErrors.password && (
            <Field.ErrorText>{validationErrors.password}</Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!validationErrors.confirmPassword}>
          <Field.Label>Confirmar contraseña</Field.Label>
          <Input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="••••••••"
            size={{ base: 'md', md: 'lg' }}
          />
          {validationErrors.confirmPassword && (
            <Field.ErrorText>{validationErrors.confirmPassword}</Field.ErrorText>
          )}
        </Field.Root>

        <Button
          type="submit"
          colorScheme="blue"
          size={{ base: 'md', md: 'lg' }}
          loading={isLoading}
          loadingText="Creando cuenta..."
          w="full"
        >
          Crear Cuenta
        </Button>

        <Text textAlign="center" fontSize="sm" color="gray.600">
          ¿Ya tienes cuenta?{' '}
          <Link
            color="blue.500"
            onClick={onSwitchToLogin}
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
          >
            Inicia sesión aquí
          </Link>
        </Text>
      </VStack>
    </form>
  );
}