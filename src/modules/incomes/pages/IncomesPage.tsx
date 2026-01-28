import {
  Box,
  Heading,
  Text,
  Button,
  Badge,
  HStack,
  VStack,
  NativeSelectRoot,
  NativeSelectField,
  IconButton,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from "@chakra-ui/react";

import { FiMoreVertical, FiEdit, FiTrash2, FiTrendingUp } from "react-icons/fi";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { formatDate, formatNumber, showToaster } from "@/app/utils/utils";
import { projectsService } from "@/services/projects/ProjectsService";
import type { ISelect } from "@/app";
import { FormIncomes } from "../components/FormIncomes";
import { incomesService } from "@/services/incomes/IncomesServices";

const formDefaultsValues = {
  typeExpense: "COSTO",
  concept: undefined,
  type: "",
  quantity: 1,
  price: 0,
  totalPrice: 0,
  description: "",
  projectId: undefined,
};

export function IncomesPage() {
  const [incomes, setIncomes] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [formDefaults, setFormDefaults] = useState<any>(formDefaultsValues);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [projects, setProjects] = useState<ISelect[]>([]);

  useEffect(() => {
    getAllIncomes();
    getProjects();
  }, []);

  const refreshDashboard = () => {
    getAllIncomes();
  };

  const getAllIncomes = async () => {
    const resp = await incomesService.getIncomes();
    if (resp.statusCode === 200) {
      setIncomes(resp.data);
    } else {
      showToaster({
        type: "warning",
        description: resp.message || "No se pudo cargar los ingresos",
      });
    }
  };

  const transformData = (income: any) => {
    return {
      id: income.id,
      projectId: income.project_id,
      type: income.type,
      incomeName: income.income_name,
      incomeValue: parseFloat(income.income_value),
      paymentMethod: income.payment_method,
      referenceNumber: income.reference_number,
      incomeDate: formatDate(income.income_date),
      description: income.description,
    };
  };

  const deleteIncomeById = async (id: any) => {
    const resp = await incomesService.deleteIncome(id);
    if (resp.statusCode === 200) {
      showToaster({
        type: "success",
        description: "Egreso eliminado exitosamente",
      });
    } else {
      showToaster({
        type: "warning",
        description: resp.message || "No se pudo eliminar el egreso",
      });
    }
    await refreshDashboard();
  };

  const getProjects = async () => {
    const response = await projectsService.getProjects("ALL");

    if (response.statusCode === 200) {
      setProjects(response.data);
    } else {
      showToaster({
        type: "error",
        description:
          response.message || "Error al cargar los proyectos de egreso",
        duration: 3000,
      });
    }
  };

  // Filter egresos by selected project
  const filteredIncomes = selectedProject
    ? incomes.filter((income) => income.project_id == selectedProject)
    : incomes;


  const totalIncomes = filteredIncomes.reduce(
    (sum, income) => sum + parseFloat(income.income_value),
    0,
  );

  return (
    <VStack gap="6" align="stretch">
      <HStack flexWrap="wrap" justify="space-between" align="start">
        <Box>
          <Heading size="lg" color="fg.emphasized">
            Ingresos
          </Heading>
          <Text color="fg.muted" mt="1">
            Gestiona todos los ingresos de tus proyectos
          </Text>
        </Box>
        <HStack gap="3">
          <Box>
            <NativeSelectRoot>
              <NativeSelectField
                minW="16rem"
                mr="2"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                placeholder="Filtrar por proyecto"
              >
                <option value="">Todos los proyectos</option>
                {projects.map((project) => (
                  <option key={project.key} value={project.value}>
                    {project.label}
                  </option>
                ))}
              </NativeSelectField>
              <Button
                colorScheme="blue"
                onClick={() => {
                  setFormDefaults(formDefaultsValues);
                  setFormMode("create");
                  setOpen(true);
                }}
              >
                <IoMdAdd style={{ marginRight: 8 }} />
                Nuevo Ingreso
              </Button>
            </NativeSelectRoot>
          </Box>
          <FormIncomes
            defaultValues={formDefaults}
            mode={formMode}
            open={open}
            setOpen={setOpen}
            refreshDashboard={refreshDashboard}
            projects={projects}
          />
        </HStack>
      </HStack>
      <Box
      // bg="bg.panel"
      // borderRadius="lg"
      // borderWidth="1px"
      // borderColor="border.subtle"
      // p="4"
      >
        <HStack gap="10">
          <VStack
            align="start"
            bg="bg.panel"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.subtle"
            boxShadow="sm"
            pr="4"
            pl="4"
            pt="2"
            pb="2"
          >
            <Text fontSize="sm" color="fg.muted" fontWeight="medium">
              Total Ingresos
            </Text>
            <HStack>
              <FiTrendingUp color="green" />
              <Text fontSize="xl" fontWeight="bold" color="green.500">
                {formatNumber(totalIncomes)}
              </Text>
            </HStack>
          </VStack>
          <VStack
            align="start"
            bg="bg.panel"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.subtle"
            boxShadow="sm"
            pr="4"
            pl="4"
            pt="2"
            pb="2"
          >
            <Text fontSize="sm" color="fg.muted" fontWeight="medium">
              Valor * mes promedio
            </Text>
            <Text fontSize="xl" fontWeight="semibold">
              {formatNumber(totalIncomes * 0.4)}
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Egresos List */}
      <VStack gap="3" align="stretch">
        {filteredIncomes.map((income) => (
          <Box
            key={income.id}
            // bg="bg.muted"
            bg="bg.panel"
            borderRadius="lg"
            borderWidth="1px"
            // borderColor="border.muted"
            borderColor="border.subtle"
            boxShadow="sm"
            paddingLeft="4"
            paddingRight="4"
            paddingTop="2"
            paddingBottom="2"
            minWidth="16rem"
            // p="5"
          >
            <HStack
              justify="space-between"
              align="start"
              alignItems="center"
              flexWrap="wrap"
            >
              <VStack align="start" gap="1" minWidth="16rem" width="30%">
                <Text fontWeight="medium" fontSize="md">
                  {income.income_name}
                </Text>
                <Text color="fg.muted" fontSize="xs">
                  {income.description}
                </Text>
              </VStack>
              <VStack
                gap="1"
                fontWeight="bold"
                align="start"
                minWidth="16rem"
                width="30%"
              >
                <HStack>
                  <Text color="fg.muted" fontSize="sm">
                    {income.type}
                  </Text>
                  <Text color="fg.muted" fontSize="sm">
                    {income.payment_method}
                  </Text>
                  <Text color="fg.muted" fontSize="sm">
                    {income.reference_number}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" color="fg.muted">
                    {new Date(income.income_date).toLocaleDateString()}
                  </Text>
                </HStack>
              </VStack>
              <VStack align="start" gap="1" minWidth="8rem" paddingRight="1rem">
                <Text fontSize="lg" fontWeight="bold" color="green.500">
                  {formatNumber(income.income_value)}
                </Text>
                <Badge colorPalette="blue" size="sm" fontWeight="bold">
                  {income.project_name}
                </Badge>
              </VStack>
              <VStack
                align="end"
                gap="1"
                minWidth="5rem"
                width="2%"
                position="absolute"
                right="1.5rem"
              >
                <HStack>
                  <MenuRoot>
                    <MenuTrigger asChild>
                      <IconButton variant="ghost" size="sm">
                        <FiMoreVertical />
                      </IconButton>
                    </MenuTrigger>
                    <MenuContent>
                      <MenuItem
                        value="edit"
                        onClick={() => {
                          setFormDefaults(transformData(income));
                          setFormMode("edit");
                          setOpen(true);
                        }}
                      >
                        <FiEdit />
                        Editar
                      </MenuItem>
                      <MenuItem
                        value="delete"
                        color="fg.error"
                        onClick={() => {
                          deleteIncomeById(income.id);
                        }}
                      >
                        <FiTrash2 />
                        Eliminar
                      </MenuItem>
                    </MenuContent>
                  </MenuRoot>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}
