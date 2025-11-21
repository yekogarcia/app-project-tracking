import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text, Link, Alert } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/store/appStore"; // 🎯 Cambiado a Zustand
import { Form, InputField } from "../../../app/components/ui/forms";
import { loginSchema, type LoginFormData } from "../schemas";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuth(); // 🎯 Zustand hook

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect to admin dashboard after successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
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
      {error && (
        <Alert.Root status="error" borderRadius="md">
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}

      <InputField
        name="email"
        control={form.control}
        label="Email"
        type="email"
        placeholder="tu@email.com"
        isRequired
      />

      <InputField
        name="password"
        control={form.control}
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        isRequired
      />

      <Button
        type="submit"
        colorScheme="blue"
        size={{ base: "md", md: "lg" }}
        loading={isLoading}
        loadingText="Iniciando sesión..."
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
