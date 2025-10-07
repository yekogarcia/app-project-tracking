import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Icon,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { ResponsiveLayout } from "../../../app/components/layout/ResponsiveLayout";
import { BreakpointDebug } from "../../../app/components/ui/BreakpointDebug";
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiFolderPlus,
  FiDollarSign 
} from "react-icons/fi";

export function AdminDashboard() {
  return (
    <ResponsiveLayout variant="admin">
      <BreakpointDebug />
      <VStack gap="6" align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" color={{ base: "gray.900", _dark: "white" }}>
            Dashboard
          </Heading>
          <Text color={{ base: "gray.600", _dark: "gray.400" }} mt="1">
            Resumen general de tu proyecto
          </Text>
        </Box>

        {/* Stats Grid */}
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap="6"
        >
          <GridItem>
            <Box
              bg={{ base: "white", _dark: "gray.800" }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "gray.700" }}
              p="6"
            >
              <HStack justify="space-between" align="start">
                <Box>
                  <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>Total Ingresos</Text>
                  <Text fontSize="2xl" fontWeight="bold" color={{ base: "gray.900", _dark: "white" }}>
                    $45,231
                  </Text>
                  <Text fontSize="sm" color="green.500">
                    ↗ 23.36%
                  </Text>
                </Box>
                <Icon 
                  as={FiTrendingUp} 
                  boxSize="8" 
                  color="green.500" 
                  bg={{ base: "green.50", _dark: "green.900" }}
                  p="2" 
                  borderRadius="md"
                />
              </HStack>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              bg={{ base: "white", _dark: "gray.800" }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "gray.700" }}
              p="6"
            >
              <HStack justify="space-between" align="start">
                <Box>
                  <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>Total Egresos</Text>
                  <Text fontSize="2xl" fontWeight="bold" color={{ base: "gray.900", _dark: "white" }}>
                    $12,426
                  </Text>
                  <Text fontSize="sm" color="red.500">
                    ↘ 4.05%
                  </Text>
                </Box>
                <Icon 
                  as={FiTrendingDown} 
                  boxSize="8" 
                  color="red.500" 
                  bg={{ base: "red.50", _dark: "red.900" }}
                  p="2" 
                  borderRadius="md"
                />
              </HStack>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              bg={{ base: "white", _dark: "gray.800" }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "gray.700" }}
              p="6"
            >
              <HStack justify="space-between" align="start">
                <Box>
                  <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>Proyectos Activos</Text>
                  <Text fontSize="2xl" fontWeight="bold" color={{ base: "gray.900", _dark: "white" }}>
                    12
                  </Text>
                  <Text fontSize="sm" color="blue.500">
                    ↗ 2 nuevos
                  </Text>
                </Box>
                <Icon 
                  as={FiFolderPlus} 
                  boxSize="8" 
                  color="blue.500" 
                  bg={{ base: "blue.50", _dark: "blue.900" }}
                  p="2" 
                  borderRadius="md"
                />
              </HStack>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              bg={{ base: "white", _dark: "gray.800" }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "gray.700" }}
              p="6"
            >
              <HStack justify="space-between" align="start">
                <Box>
                  <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>Balance</Text>
                  <Text fontSize="2xl" fontWeight="bold" color={{ base: "gray.900", _dark: "white" }}>
                    $32,805
                  </Text>
                  <Text fontSize="sm" color="purple.500">
                    ↗ 12.5%
                  </Text>
                </Box>
                <Icon 
                  as={FiDollarSign} 
                  boxSize="8" 
                  color="purple.500" 
                  bg={{ base: "purple.50", _dark: "purple.900" }}
                  p="2" 
                  borderRadius="md"
                />
              </HStack>
            </Box>
          </GridItem>
        </Grid>

        {/* Recent Activity */}
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "2fr 1fr",
          }}
          gap="6"
        >
          <GridItem>
            <Box
              bg={{ base: "white", _dark: "gray.800" }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "gray.700" }}
              p="6"
            >
              <Heading size="md" mb="4" color={{ base: "gray.900", _dark: "white" }}>
                Actividad Reciente
              </Heading>
              <VStack gap="3" align="stretch">
                <Box p="3" bg={{ base: "gray.50", _dark: "gray.700" }} borderRadius="md">
                  <Text fontWeight="medium" color={{ base: "gray.900", _dark: "white" }}>Nuevo ingreso registrado</Text>
                  <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>
                    $2,500 - Proyecto Web App
                  </Text>
                </Box>
                <Box p="3" bg={{ base: "gray.50", _dark: "gray.700" }} borderRadius="md">
                  <Text fontWeight="medium" color={{ base: "gray.900", _dark: "white" }}>Egreso procesado</Text>
                  <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>
                    $450 - Hosting mensual
                  </Text>
                </Box>
                <Box p="3" bg={{ base: "gray.50", _dark: "gray.700" }} borderRadius="md">
                  <Text fontWeight="medium" color={{ base: "gray.900", _dark: "white" }}>Proyecto completado</Text>
                  <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>
                    Sistema de inventario
                  </Text>
                </Box>
              </VStack>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              bg={{ base: "white", _dark: "gray.800" }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "gray.700" }}
              p="6"
            >
              <Heading size="md" mb="4" color={{ base: "gray.900", _dark: "white" }}>
                Proyectos Pendientes
              </Heading>
              <VStack gap="3" align="stretch">
                <Box>
                  <Text fontWeight="medium" color={{ base: "gray.900", _dark: "white" }}>E-commerce Platform</Text>
                  <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>
                    Progreso: 75%
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="medium" color={{ base: "gray.900", _dark: "white" }}>Mobile App</Text>
                  <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>
                    Progreso: 45%
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="medium" color={{ base: "gray.900", _dark: "white" }}>Dashboard Analytics</Text>
                  <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>
                    Progreso: 90%
                  </Text>
                </Box>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </ResponsiveLayout>
  );
}