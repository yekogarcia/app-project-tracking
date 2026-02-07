import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/store/appStore";
import { Button, Text, Link, Alert, Grid, GridItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

import {
  Form,
  InputField,
  SelectField,
} from "../../../app/components/ui/forms";
import { registerSchema, type RegisterFormData } from "../schemas";
import { registerUserService as service } from "../../../services/auth/RegisterUserServices";
// import { Form } from "@/app/components/ui/forms/Form";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  /** 🎯 Valores por defecto opcionales para el formulario */
  defaultValues?: Partial<RegisterFormData>;
  /** 📝 Modo del formulario: 'create' | 'edit' */
  mode?: "create" | "edit";
}

export function RegisterForm({
  onSwitchToLogin,
  defaultValues: propDefaultValues,
  mode = "create",
}: RegisterFormProps) {
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🎯 Valores por defecto base del formulario
  const baseDefaultValues: Partial<RegisterFormData> = {
    type: undefined,
    name: "",
    email: "",
    phone: undefined, // Campo numérico
    address: "",
    password: "",
    confirmPassword: "",
  };

  // 🔄 Mergear valores por defecto base con los proporcionados
  const mergedDefaultValues = useMemo(
    () => ({
      ...baseDefaultValues,
      ...propDefaultValues,
    }),
    [propDefaultValues]
  );

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: mergedDefaultValues,
  });

  // 🔄 Resetear formulario cuando cambien los valores por defecto
  useEffect(() => {
    form.reset(mergedDefaultValues);
  }, [form, mergedDefaultValues]);

  // Redirect to admin dashboard after successful registration
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Iniciar loading
      setIsSubmitting(true);
      setSuccessMessage(null);
      setErrorMessage(null);
      
      const resp = await service.registerCompanyAndUser(data);

      if (resp.statusCode === 200) {
        setSuccessMessage(
          "¡Registro exitoso! Redirigiendo al inicio de sesión..."
        );
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        setErrorMessage(
          resp.message || "Error al registrar. Por favor, intenta nuevamente."
        );
      }
    } catch (err) {
      setErrorMessage(
        "Ocurrió un error inesperado. Por favor, verifica tu conexión e intenta nuevamente."
      );
      console.error("Error en registro:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      width="600px"
      maxWidth="100%"
      mx="auto"
      display="flex"
      flexDirection="column"
      gap={4}
    >
      {error && (
        <Alert.Root status="error" borderRadius="md">
          <Alert.Indicator>
            <FiAlertCircle />
          </Alert.Indicator>
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}

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

      {/* Tipo de usuario - Ocupa toda la fila */}
      <SelectField
        name="type"
        control={form.control}
        label="Tipo de usuario"
        placeholder="Selecciona el tipo"
        isRequired
        disabled={isSubmitting}
        options={[
          { value: "PERSONAL", label: "Persona Natural" },
          { value: "COMPANY", label: "Empresa" },
        ]}
      />

      {/* Grid de 2 columnas para los otros campos */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        <GridItem>
          <InputField
            name="name"
            control={form.control}
            label="Nombre completo"
            placeholder="Tu nombre completo"
            isRequired
            disabled={isSubmitting}
          />
        </GridItem>

        <GridItem>
          <InputField
            name="email"
            control={form.control}
            label="Email"
            type="email"
            placeholder="tu@email.com"
            isRequired
            disabled={isSubmitting}
          />
        </GridItem>

        <GridItem>
          <InputField
            name="phone"
            type="number"
            control={form.control}
            label="Teléfono"
            placeholder="3001234567"
            isRequired
            disabled={isSubmitting}
          />
        </GridItem>

        <GridItem>
          <InputField
            name="address"
            control={form.control}
            label="Dirección"
            placeholder="Calle 123 # 45-67, Ciudad"
            isRequired
            disabled={isSubmitting}
          />
        </GridItem>

        <GridItem>
          <InputField
            name="password"
            control={form.control}
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            isRequired
            disabled={isSubmitting}
          />
        </GridItem>

        <GridItem>
          <InputField
            name="confirmPassword"
            control={form.control}
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            isRequired
            disabled={isSubmitting}
          />
        </GridItem>
      </Grid>

      {/* Botón de envío - Ocupa toda la fila */}
      <Button
        type="submit"
        colorScheme="blue"
        size={{ base: "md", md: "lg" }}
        loading={isSubmitting || isLoading}
        loadingText={mode === "edit" ? "Actualizando..." : "Registrando..."}
        disabled={isSubmitting}
        w="full"
        mt={2}
      >
        {mode === "edit" ? "Actualizar Datos" : "Crear Cuenta"}
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
    </Form>
  );
}
