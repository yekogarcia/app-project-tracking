import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text, Link, Alert } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { authService } from "../../../services/auth/AuthService";

import { Form, InputField } from "../../../app/components/ui/forms";
import { loginSchema, type LoginFormData } from "../schemas";
import { useAuthStore } from "../store/auth.store";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login } = useAuthStore();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const response = await authService.login(data);

    if (response.isAuthenticated) {
      setSuccessMessage("¡Inicio de sesión exitoso! Redirigiendo...");
      login(response.user);
      navigate("/admin");
    } else {
      setErrorMessage(response.message);
    }
    setLoading(false);
  };

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      width="100%"
      maxWidth="100%"
      mx="auto"
      display="flex"
      flexDirection="column"
      gap={4}
    >
      {errorMessage && (
        <Alert.Root status="error" borderRadius="md">
          <Alert.Indicator>
            <FiAlertCircle />
          </Alert.Indicator>
          <Alert.Title>{errorMessage}</Alert.Title>
        </Alert.Root>
      )}

      {successMessage && (
        <Alert.Root status="success" borderRadius="md">
          <Alert.Indicator>
            <FiCheckCircle />
          </Alert.Indicator>
          <Alert.Title>{successMessage}</Alert.Title>
        </Alert.Root>
      )}

      <InputField
        name="email"
        control={form.control}
        label="Email"
        type="email"
        placeholder="tu@email.com"
        isRequired
        disabled={loading}
      />

      <InputField
        name="password"
        control={form.control}
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        isRequired
        disabled={loading}
      />

      <Button
        type="submit"
        colorScheme="blue"
        size={{ base: "md", md: "lg" }}
        loading={loading}
        loadingText="Iniciando sesión..."
        disabled={loading}
        w="full"
      >
        Iniciar Sesión
      </Button>

      <Text textAlign="center" fontSize="sm" color="gray.600" mt={6}>
        ¿No tienes cuenta?{" "}
        <Link
          color="blue.500"
          onClick={onSwitchToRegister}
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
        >
          Regístrate aquí
        </Link>
      </Text>

      <Text textAlign="center" fontSize="xs" color="gray.500" mt={2}>
        Demo: admin@example.com / admin123
      </Text>
    </Form>
  );
}
