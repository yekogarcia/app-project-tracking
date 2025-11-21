import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text, Link, Alert, Grid, GridItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/store/appStore"; // 🎯 Cambiado a Zustand
import {
  Form,
  InputField,
  SelectField,
  NumberField,
} from "../../../app/components/ui/forms";
import { registerSchema, type RegisterFormData } from "../schemas";
// import { Form } from "@/app/components/ui/forms/Form";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  /** 🎯 Valores por defecto opcionales para el formulario */
  defaultValues?: Partial<RegisterFormData>;
  /** 📝 Modo del formulario: 'create' | 'edit' */
  mode?: 'create' | 'edit';
}

export function RegisterForm({ 
  onSwitchToLogin, 
  defaultValues: propDefaultValues,
  mode = 'create' 
}: RegisterFormProps) {
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, register } = useAuth(); // 🎯 Zustand hook

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
  const mergedDefaultValues = useMemo(() => ({
    ...baseDefaultValues,
    ...propDefaultValues,
  }), [propDefaultValues]);

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
    await register(data);
    console.log("Registro exitoso:", data);
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
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}

      {/* Tipo de usuario - Ocupa toda la fila */}
      <SelectField
        name="type"
        control={form.control}
        label="Tipo de usuario"
        placeholder="Selecciona el tipo"
        isRequired
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
          />
        </GridItem>

        <GridItem>
          <NumberField
            name="phone"
            control={form.control}
            label="Teléfono"
            placeholder="3001234567"
            allowDecimals={false}
            min={1000000000}
            max={9999999999}
            helperText="Solo números (ej: 3001234567)"
            isRequired
          />
        </GridItem>

        <GridItem>
          <InputField
            name="address"
            control={form.control}
            label="Dirección"
            placeholder="Calle 123 # 45-67, Ciudad"
            isRequired
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
          />
        </GridItem>
      </Grid>

      {/* Botón de envío - Ocupa toda la fila */}
      <Button
        type="submit"
        colorScheme="blue"
        size={{ base: "md", md: "lg" }}
        loading={isLoading}
        loadingText={mode === 'edit' ? "Actualizando..." : "Creando cuenta..."}
        w="full"
        mt={2}
      >
        {mode === 'edit' ? 'Actualizar Datos' : 'Crear Cuenta'}
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
