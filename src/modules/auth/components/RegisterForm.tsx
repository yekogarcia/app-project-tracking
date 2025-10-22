import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text, Link, Alert, Grid, GridItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FormProvider,
  FormField,
  FormSelect,
} from "../../../app/components/ui/forms";
import { registerSchema, type RegisterFormData } from "../schemas";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      type: "PERSONA",
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Redirect to admin dashboard after successful registration
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    clearError();

    // Convert to the format expected by the register function
    const registerData = {
      type: data.type,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    await register(registerData);
  };

  return (
    <FormProvider
      form={form}
      onSubmit={onSubmit}
      width="100%"
      maxWidth="600px"
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

      {/* Tipo de usuario - Ocupa toda la fila */}
      <FormSelect
        name="type"
        control={form.control}
        label="Tipo de usuario"
        placeholder="Selecciona el tipo"
        isRequired
        options={[
          { value: "PERSONA", label: "Persona Natural" },
          { value: "EMPRESA", label: "Empresa" },
        ]}
      />

      {/* Grid de 2 columnas para los otros campos */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        <GridItem>
          <FormField
            name="name"
            control={form.control}
            label="Nombre completo"
            placeholder="Tu nombre completo"
            isRequired
          />
        </GridItem>

        <GridItem>
          <FormField
            name="email"
            control={form.control}
            label="Email"
            type="email"
            placeholder="tu@email.com"
            isRequired
          />
        </GridItem>

        <GridItem>
          <FormField
            name="phone"
            control={form.control}
            label="Teléfono"
            type="tel"
            placeholder="+57 300 123 4567"
            isRequired
          />
        </GridItem>

        <GridItem>
          <FormField
            name="address"
            control={form.control}
            label="Dirección"
            placeholder="Calle 123 # 45-67, Ciudad"
            isRequired
          />
        </GridItem>

        <GridItem>
          <FormField
            name="password"
            control={form.control}
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            isRequired
          />
        </GridItem>

        <GridItem>
          <FormField
            name="confirmPassword"
            control={form.control}
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            isRequired
          />
        </GridItem>
      </Grid>

      {/* Botón de envío - Ocupa toda la fila */}
      <Button
        type="submit"
        colorScheme="blue"
        size={{ base: "md", md: "lg" }}
        loading={isLoading}
        loadingText="Creando cuenta..."
        w="full"
        mt={2}
      >
        Crear Cuenta
      </Button>

      <Text textAlign="center" fontSize="sm" color="gray.600" mt={6}>
        ¿Ya tienes cuenta?{" "}
        <Link
          color="blue.500"
          onClick={onSwitchToLogin}
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
        >
          Inicia sesión aquí
        </Link>
      </Text>
    </FormProvider>
  );
}
