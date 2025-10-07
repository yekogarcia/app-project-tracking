import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Textarea,
  Badge,
  Separator,
} from "@chakra-ui/react";

import { FiEdit, FiSave, FiUser, FiCalendar } from "react-icons/fi";
import { useState } from "react";

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Admin User",
    email: "admin@example.com",
    bio: "Administrador del sistema de seguimiento de proyectos",
    phone: "+1 234 567 8900",
    location: "Ciudad, País",
  });

  const handleSave = () => {
    // Aquí implementarías la lógica para guardar los cambios
    setIsEditing(false);
    console.log("Perfil actualizado");
  };

  const handleLogout = () => {
    // Aquí implementarías la lógica de logout
    console.log("Sesión cerrada");
  };

  return (
    <VStack gap="6" align="stretch">
        {/* Header */}
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
                  {formData.name.charAt(0)}
                </Box>
                <VStack gap="1">
                  <Heading size="md">{formData.name}</Heading>
                  <Text color="fg.muted">{formData.email}</Text>
                  <Badge colorScheme="green" variant="subtle">
                    Administrador
                  </Badge>
                </VStack>

                <Separator />

                <VStack gap="3" align="stretch" w="full">
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
                </VStack>

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
            >
              <HStack justify="space-between" mb="6">
                <Heading size="md">Información Personal</Heading>
                <Button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  colorScheme={isEditing ? "green" : "blue"}
                  variant={isEditing ? "solid" : "outline"}
                >
                  {isEditing ? <FiSave /> : <FiEdit />}
                  {isEditing ? "Guardar" : "Editar"}
                </Button>
              </HStack>

              <VStack gap="4" align="stretch">
                <Grid
                  templateColumns={{
                    base: "1fr",
                    md: "1fr 1fr",
                  }}
                  gap="4"
                >
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">
                      Nombre completo
                    </Text>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      readOnly={!isEditing}
                      bg={isEditing ? "bg.canvas" : "bg.muted"}
                    />
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">
                      Email
                    </Text>
                    <Input
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      readOnly={!isEditing}
                      bg={isEditing ? "bg.canvas" : "bg.muted"}
                    />
                  </Box>
                </Grid>

                <Grid
                  templateColumns={{
                    base: "1fr",
                    md: "1fr 1fr",
                  }}
                  gap="4"
                >
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">
                      Teléfono
                    </Text>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      readOnly={!isEditing}
                      bg={isEditing ? "bg.canvas" : "bg.muted"}
                    />
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">
                      Ubicación
                    </Text>
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      readOnly={!isEditing}
                      bg={isEditing ? "bg.canvas" : "bg.muted"}
                    />
                  </Box>
                </Grid>

                <Box>
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
                </Box>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </VStack>
  );
}
