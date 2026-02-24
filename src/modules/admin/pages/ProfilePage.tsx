import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Separator,
} from "@chakra-ui/react";

import { FiEdit, FiSave, FiUser, FiX } from "react-icons/fi";
import { useState } from "react";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { authService } from "@/services/auth/AuthService";
import { useNavigate } from "react-router-dom";
import { profileService } from "@/services/settings/ProfileService";
import {
  profileSchema,
  type ProfileFormData,
} from "@/modules/admin/schemas/schemaProfile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/app/components/ui/forms/InputField";
import { showToaster } from "@/app/utils/utils";
import { Toaster } from "@/app/components/ux/toaster";

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPass, setIsEditingPass] = useState(false);
  const { account, logout, login } = useAuthStore();
  const navigate = useNavigate();

  const defaultValues: Partial<ProfileFormData> = {
    name: account.name,
    email: account.email,
    phone: Number(account.phone),
    address: account.company?.address || "",
    password: "",
    confirmPassword: "",
    oldPassword: "",
  };

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues,
  });

  const oldPassword = watch("oldPassword");

  const onSubmit = async (data: ProfileFormData) => {
    try {

      // Actualizar perfil
      const resp = await profileService.updateProfile({
        userId: account.id,
        companyId: account.company.id,
        type: account.company.type,
        name: data.name,
        email: data.email,
        phone: data.phone.toString(),
        address: data.address,
        password: data.password || undefined,
      });

      if (resp.statusCode === 200) {
        login(resp.data);
        showToaster({
          type: "success",
          description: "Perfil actualizado exitosamente",
        });
        setIsEditing(false);
        setIsEditingPass(false);
      } else {
        showToaster({
          type: "error",
          description: "Error al actualizar el perfil",
        });
      }
    } catch (error) {
      showToaster({
        type: "error",
        description:
          (error as Error).message || "Error al actualizar el perfil",
        duration: 3000,
      });
    }
  };

  const handleCancel = () => {
    reset(defaultValues);
    setIsEditing(false);
    setIsEditingPass(false);
  };

  const handleLogout = async () => {
    logout();
    await authService.logout();
    navigate("/login");
  };

  const onValidateOldPassword = async () => {
    if (oldPassword && oldPassword.length >= 6) {
      const currentEmail = watch("email");
      const resp = await profileService.validatePassword(
        currentEmail,
        oldPassword,
      );

      if (resp.statusCode === 200 && resp.data.valid) {
        setIsEditingPass(true);
        showToaster({
          type: "success",
          description: "Contraseña verificada exitosamente",
        });
      } else {
        setIsEditingPass(false);
        showToaster({
          type: "error",
          description: "La contraseña actual no es correcta",
        });
      }
    }
  };

  return (
    <VStack gap="6" align="stretch">
      <Box>
        <Heading size="lg" color="fg.emphasized">
          Mi Perfil
        </Heading>
        <Text color="fg.muted" mt="1">
          Gestiona tu información personal y configuración de cuenta
        </Text>
      </Box>

      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1fr 2fr",
        }}
        gap="6"
      >
        {/* Profile Card */}
        <GridItem>
          <Box
            bg="bg.panel"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.subtle"
            p="6"
          >
            <VStack gap="4">
              <Box
                w="20"
                h="20"
                borderRadius="full"
                bg="blue.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="2xl"
                fontWeight="bold"
              >
                {account.name.charAt(0)}
              </Box>
              <VStack gap="1">
                <Heading size="md">{account.name}</Heading>
                <Text color="fg.muted">{account.email}</Text>
                <Badge colorScheme="green" variant="subtle">
                  Administrador
                </Badge>
              </VStack>

              <Separator />

              {/* <VStack gap="3" align="stretch" w="full">
                  <HStack>
                    <FiUser />
                    <Text fontSize="sm">Miembro desde</Text>
                  </HStack>
                  <Text fontSize="sm" color="fg.muted" ml="6">
                    Enero 2024
                  </Text>

                  <HStack>
                    <FiCalendar />
                    <Text fontSize="sm">Último acceso</Text>
                  </HStack>
                  <Text fontSize="sm" color="fg.muted" ml="6">
                    Hace 2 horas
                  </Text>
                </VStack> */}

              <Button
                colorScheme="red"
                variant="outline"
                onClick={handleLogout}
                w="full"
              >
                <FiUser />
                Cerrar Sesión
              </Button>
            </VStack>
          </Box>
        </GridItem>

        {/* Profile Form */}
        <GridItem>
          <Box
            bg="bg.panel"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.subtle"
            p="6"
            as="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Toaster />
            <HStack justify="space-between" mb="6">
              <Heading size="md">Información Personal</Heading>
              <HStack gap="2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleCancel}
                      colorScheme="gray"
                      variant="outline"
                      type="button"
                    >
                      <FiX />
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="green"
                      variant="solid"
                      loading={isSubmitting}
                    >
                      <FiSave />
                      Guardar
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    colorScheme="blue"
                    variant="outline"
                  >
                    <FiEdit />
                    Editar
                  </Button>
                )}
              </HStack>
            </HStack>

            <VStack gap="4" align="stretch">
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "1fr 1fr",
                }}
                gap="4"
              >
                <InputField
                  name="name"
                  control={control}
                  label="Nombre completo"
                  isRequired
                  disabled={!isEditing}
                />

                <InputField
                  name="email"
                  control={control}
                  label="Email"
                  type="email"
                  isRequired
                  disabled={!isEditing}
                />
              </Grid>

              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "1fr 1fr",
                }}
                gap="4"
              >
                <InputField
                  name="phone"
                  control={control}
                  label="Teléfono"
                  type="number"
                  isRequired
                  disabled={!isEditing}
                />

                <InputField
                  name="address"
                  control={control}
                  label="Dirección"
                  isRequired
                  disabled={!isEditing}
                />
              </Grid>

              <VStack gap="4" align="stretch">
                <Heading size="md">Actualizar contraseña</Heading>
                <Grid
                  templateColumns={{
                    base: "1fr",
                    md: "1fr 1fr",
                  }}
                  gap="4"
                >
                  <InputField
                    name="oldPassword"
                    control={control}
                    label="Contraseña actual"
                    type="password"
                    disabled={!isEditing}
                    onBlur={onValidateOldPassword}
                    helperText="Ingresa tu contraseña actual para poder cambiarla"
                  />
                </Grid>
                <Grid
                  templateColumns={{
                    base: "1fr",
                    md: "1fr 1fr",
                  }}
                  gap="4"
                >
                  <InputField
                    name="password"
                    control={control}
                    label="Nueva contraseña"
                    type="password"
                    disabled={!isEditingPass}
                    helperText="Mínimo 6 caracteres"
                  />

                  <InputField
                    name="confirmPassword"
                    control={control}
                    label="Confirmar nueva contraseña"
                    type="password"
                    disabled={!isEditingPass}
                  />
                </Grid>
              </VStack>

              {/* <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="2">
                    Biografía
                  </Text>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    readOnly={!isEditing}
                    bg={isEditing ? "bg.canvas" : "bg.muted"}
                    rows={4}
                  />
                </Box> */}
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </VStack>
  );
}
