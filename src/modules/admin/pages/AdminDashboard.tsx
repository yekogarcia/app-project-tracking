import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Icon,
  HStack,
  VStack,
  Badge,
  NativeSelectRoot,
  NativeSelectField,
} from "@chakra-ui/react";

import { BreakpointDebug } from "../../../app/components/ui/BreakpointDebug";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiFolderPlus,
  FiDollarSign,
  FiLayers,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { projectsService } from "@/services/projects/ProjectsService";
import type { ISelect } from "@/app";
import { formatNumber, formatPorcentage, showToaster } from "@/app/utils/utils";

export function AdminDashboard() {
  const [projects, setProjects] = useState<ISelect[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [values, setValues] = useState<any>({
    totalIncomes: 0,
    totalExpenses: 0,
    netProfit: 0,
    netMargin: 0,
    grossProfit: 0,
    grossMargin: 0,
    Profitability: 0,
  });

  const [selectedProject, setSelectedProject] = useState<string>("");
  const [parentId, setParentId] = useState<number | null>(null);

  useEffect(() => {
    getProjects();
    getAllTotals();
  }, []);

  // const refreshDashboard = () => {
  //   getAllTotals();
  // };

  const getAllTotals = async () => {
    const resp = await projectsService.getAllTotals(
      `projectId=${selectedProject ?? ""}`,
    );
    console.log("parentId", parentId);
    console.log("getAllTotals", resp);
    if (resp.statusCode !== 200) {
      showToaster({
        type: "warning",
        description: resp.message || "No se pudo cargar los egresos",
      });
    } else {
      setTotals(resp.data);
      calculateValues();
    }
  };

  useEffect(() => {
    calculateValues();
  }, [totals]);

  useEffect(() => {
    getAllTotals();
  }, [selectedProject]);

  const calculateValues = () => {
    let totalIncomes = 0;
    let totalExpenses = 0;
    let netProfit = 0;
    let grossProfit = 0;
    totals?.map((total: any) => {
      totalIncomes += Number(total.totalIncomes);
      totalExpenses += Number(total.totalExpenses);
    });
    netProfit = totalIncomes - totalExpenses;
    grossProfit = totalIncomes - totalExpenses;
    setValues({
      totalIncomes,
      totalExpenses,
      netProfit,
      netMargin: totalExpenses !== 0 ? netProfit / totalIncomes * 100 : 0,
      grossProfit,
      grossMargin: totalIncomes !== 0 ? grossProfit / totalIncomes * 100 : 0,
      Profitability: totalIncomes !== 0 ? (netProfit / totalIncomes) * 100 : 0,
    });
  };

  // console.log("values", values);

  const onSelectedProject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("onSelectedProject", e.target.value);

    setSelectedProject(e.target.value);
    const parent = projects.find((p) => p.parentId == e.target.value)?.parentId;
    setParentId(parent ? parent : null);
  };

  const getProjects = async () => {
    const response = await projectsService.getProjects("ALL");
    console.log("getProjects", response);
    if (response.statusCode === 200) {
      setProjects(response.data);
    }
  };

  const getIndicatorsPorcentajes = (percentage: number) => {
    if (percentage > 0) {
      return (
        <Text fontSize="sm" color="green.500">
          ↗ {formatPorcentage(percentage)}
        </Text>
      );
    } else {
      return (
        <Text fontSize="sm" color="red.500">
          ↘ {formatPorcentage(percentage)}
        </Text>
      );
    }
  };

  const getIconIndicator = (value: number) => {
    if (value > 0) {
      return (
        <Icon
          as={FiTrendingUp}
          boxSize="8"
          color="green.500"
          bg={{ base: "green.50", _dark: "green.900" }}
          p="2"
          borderRadius="md"
        />
      );
    } else {
      return (
        <Icon
          as={FiTrendingDown}
          boxSize="8"
          color="red.500"
          bg={{ base: "red.50", _dark: "red.900" }}
          p="2"
          borderRadius="md"
        />
      );
    }
  };

  return (
    <VStack gap="6" align="stretch">
      <BreakpointDebug />
      {/* Header */}
      <Box>
        <Heading size="lg" color={{ base: "gray.900", _dark: "white" }}>
          Dashboard
        </Heading>
        <Text color={{ base: "gray.600", _dark: "gray.400" }} mt="1">
          Resumen general de tus proyectos
        </Text>
      </Box>
      <Box width={{ base: "30rem", md: "auto" }}>
        <NativeSelectRoot
          display="flex"
          alignItems="center"
          flexDirection={{ base: "column", md: "row" }}
          gap={{ base: "3", md: "2" }}
        >
          {/* <NativeSelectField
                        minW={{ base: "100%", md: "10rem" }}
                        w={{ base: "100%", md: "14rem" }}
                        mr={{ base: "0", md: "2" }}
                        value={selectedProject}
                        onChange={(e) => onSelectedProject(e)}
                        placeholder="Selecciona el estado"
                      >
                        {statusProject.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </NativeSelectField> */}
          <NativeSelectField
            minW={{ base: "100%", md: "10rem" }}
            w={{ base: "100%", md: "14rem" }}
            mr={{ base: "0", md: "2" }}
            value={selectedProject}
            onChange={(e) => onSelectedProject(e)}
            placeholder="Todos los proyectos"
          >
            {projects.map((project) => (
              <option key={project.key} value={project.value}>
                {project.label}
              </option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>
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
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                >
                  Total Ingresos
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  {formatNumber(values.totalIncomes)}
                </Text>
                {getIndicatorsPorcentajes(0)}
              </Box>
              {getIconIndicator(values.totalIncomes)}
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
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                >
                  Total Egresos
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  {formatNumber(values.totalExpenses)}
                </Text>
               { <Text fontSize="sm" color="red.500">
                  ↘ {formatPorcentage(0)}
                </Text>}
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

        {/* <GridItem>
          <Box
            bg={{ base: "white", _dark: "gray.800" }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={{ base: "gray.200", _dark: "gray.700" }}
            p="6"
          >
            <HStack justify="space-between" align="start">
              <Box>
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                >
                  Utilidad bruta
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  {formatNumber(values.totalExpenses)}
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
        </GridItem> */}

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
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                >
                  Utilidad neta
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  {formatNumber(values.netProfit)}
                </Text>
                {getIndicatorsPorcentajes(values.netMargin)}
              </Box>
              {
                getIconIndicator(values.netProfit)
              }
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
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                >
                  Proyectos Activos
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  3
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
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                >
                  Subproyectos
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  4
                </Text>
                <Text fontSize="sm" color="orange.500">
                  En 2 proyectos
                </Text>
              </Box>
              <Icon
                as={FiLayers}
                boxSize="8"
                color="orange.500"
                bg={{ base: "orange.50", _dark: "orange.900" }}
                p="2"
                borderRadius="md"
              />
            </HStack>
          </Box>
        </GridItem>
      </Grid>

      {/* Second Row Stats */}
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
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
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                >
                  Balance
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={{ base: "gray.900", _dark: "white" }}
                >
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
            <Heading
              size="md"
              mb="4"
              color={{ base: "gray.900", _dark: "white" }}
            >
              Actividad Reciente
            </Heading>
            <VStack gap="3" align="stretch">
              <Box
                p="3"
                bg={{ base: "gray.50", _dark: "gray.700" }}
                borderRadius="md"
              >
                <Text
                  fontWeight="medium"
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  Nuevo ingreso registrado
                </Text>
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                >
                  $2,500 - Proyecto Web App
                </Text>
              </Box>
              <Box
                p="3"
                bg={{ base: "gray.50", _dark: "gray.700" }}
                borderRadius="md"
              >
                <Text
                  fontWeight="medium"
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  Egreso procesado
                </Text>
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                >
                  $450 - Hosting mensual
                </Text>
              </Box>
              <Box
                p="3"
                bg={{ base: "gray.50", _dark: "gray.700" }}
                borderRadius="md"
              >
                <Text
                  fontWeight="medium"
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  Proyecto completado
                </Text>
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                >
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
            <Heading
              size="md"
              mb="4"
              color={{ base: "gray.900", _dark: "white" }}
            >
              Proyectos Pendientes
            </Heading>
            <VStack gap="3" align="stretch">
              <Box>
                <HStack justify="space-between">
                  <Text
                    fontWeight="medium"
                    color={{ base: "gray.900", _dark: "white" }}
                  >
                    E-commerce Platform
                  </Text>
                  <Text
                    fontSize="sm"
                    color={{ base: "gray.600", _dark: "gray.400" }}
                  >
                    75%
                  </Text>
                </HStack>
                <VStack
                  align="stretch"
                  gap="1"
                  mt="2"
                  pl="3"
                  borderLeftWidth="2px"
                  borderColor="blue.500"
                >
                  <HStack justify="space-between">
                    <Text
                      fontSize="sm"
                      color={{ base: "gray.600", _dark: "gray.400" }}
                    >
                      <Badge colorScheme="blue" size="sm">
                        Frontend
                      </Badge>
                    </Text>
                    <Text
                      fontSize="xs"
                      color={{ base: "gray.500", _dark: "gray.500" }}
                    >
                      80%
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text
                      fontSize="sm"
                      color={{ base: "gray.600", _dark: "gray.400" }}
                    >
                      <Badge colorScheme="blue" size="sm">
                        Backend API
                      </Badge>
                    </Text>
                    <Text
                      fontSize="xs"
                      color={{ base: "gray.500", _dark: "gray.500" }}
                    >
                      70%
                    </Text>
                  </HStack>
                </VStack>
              </Box>
              <Box>
                <HStack justify="space-between">
                  <Text
                    fontWeight="medium"
                    color={{ base: "gray.900", _dark: "white" }}
                  >
                    Mobile App
                  </Text>
                  <Text
                    fontSize="sm"
                    color={{ base: "gray.600", _dark: "gray.400" }}
                  >
                    45%
                  </Text>
                </HStack>
                <VStack
                  align="stretch"
                  gap="1"
                  mt="2"
                  pl="3"
                  borderLeftWidth="2px"
                  borderColor="blue.500"
                >
                  <HStack justify="space-between">
                    <Text
                      fontSize="sm"
                      color={{ base: "gray.600", _dark: "gray.400" }}
                    >
                      <Badge colorScheme="blue" size="sm">
                        iOS App
                      </Badge>
                    </Text>
                    <Text
                      fontSize="xs"
                      color={{ base: "gray.500", _dark: "gray.500" }}
                    >
                      50%
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text
                      fontSize="sm"
                      color={{ base: "gray.600", _dark: "gray.400" }}
                    >
                      <Badge colorScheme="blue" size="sm">
                        Android App
                      </Badge>
                    </Text>
                    <Text
                      fontSize="xs"
                      color={{ base: "gray.500", _dark: "gray.500" }}
                    >
                      40%
                    </Text>
                  </HStack>
                </VStack>
              </Box>
              <Box>
                <HStack justify="space-between">
                  <Text
                    fontWeight="medium"
                    color={{ base: "gray.900", _dark: "white" }}
                  >
                    Dashboard Analytics
                  </Text>
                  <Text
                    fontSize="sm"
                    color={{ base: "gray.600", _dark: "gray.400" }}
                  >
                    90%
                  </Text>
                </HStack>
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                  mt="1"
                >
                  Sin subproyectos
                </Text>
              </Box>
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </VStack>
  );
}
