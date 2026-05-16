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

import {
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { FormExpenses } from "../components/FormExpenses";
import { expensesService } from "@/services/expenses/ExpensesService";
// import type { GiReturnArrow } from "react-icons/gi";
import { IoMdAdd } from "react-icons/io";
import { formatDate, formatDateShort, formatNumber, showToaster } from "@/app/utils/utils";
import { projectsService } from "@/services/projects/ProjectsService";
import type { ISelect } from "@/app";

const formDefaultsValues = {
  typeExpense: "COSTO",
  concept: undefined,
  type: "",
  quantity: "",
  price: 0,
  totalPrice: 0,
  description: "",
  projectId: undefined,
};

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [formDefaults, setFormDefaults] = useState<any>(formDefaultsValues);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [projects, setProjects] = useState<ISelect[]>([]);
  const [parentId, setParentId] = useState<number | null>(null);

  useEffect(() => {
    getAllExpenses();
    getProjects();
  }, []);

  const refreshDashboard = () => {
    getAllExpenses();
  };

  const getAllExpenses = async () => {
    const resp = await expensesService.getExpenses();
    if (resp.statusCode !== 200) {
      showToaster({
        type: "warning",
        description: resp.message || "No se pudo cargar los egresos",
      });
    } else {
      setExpenses(resp.data);
    }
  };

  const transformData = (exp: any) => {
    return {
      id: exp.id,
      projectId: exp.project_id,
      typeExpense: exp.type_expense,
      type: exp.type,
      concept: exp.concept,
      expense: exp.expense,
      price: parseFloat(exp.price),
      quantity: exp.quantity,
      totalPrice: parseFloat(exp.total_price),
      expenseDate: formatDate(exp.expense_date),
      description: exp.description,
    };
  };

  const deleteExpenseById = async (id: any) => {
    const resp = await expensesService.deleteExpense(id);
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
    }
    // else {
    //   showToaster({
    //     type: "error",
    //     description:
    //       response.message || "Error al cargar los proyectos de egreso",
    //     duration: 3000,
    //   });
    // }
  };

  // Filter egresos by selected project
  // console.log("selectedProject", selectedProject);
  // console.log("parentId", parentId);
  // console.log("expenses", expenses);
  // console.log("projects", projects);

  const filteredExpenses = selectedProject
    ? expenses.filter((expense) => expense.project_id == selectedProject || (parentId && expense.parent_id == parentId))
    : expenses;

  const totalEgresos = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.total_price),
    0,
  );

  const totalCurrentAssets = filteredExpenses.reduce(
    (sum, expense) =>
      expense.type_expense === "ACTIVO" && expense.type === "CORRIENTE"
        ? sum + parseFloat(expense.total_price)
        : sum,
    0,
  );

  const totalNonCurrentAssets = filteredExpenses.reduce(
    (sum, expense) =>
      expense.type_expense === "ACTIVO" && expense.type === "NO CORRIENTE"
        ? sum + parseFloat(expense.total_price)
        : sum,
    0,
  );

  const getColorType = (type: string) => {
    if (type === "CORRIENTE") {
      return "green.500";
    } else if (type === "NO CORRIENTE") {
      return "blue.500";
    } else {
      return "red.500";
    }
  };

  const onSelectedProject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value);
    const parent = projects.find((p) => p.parentId == e.target.value)?.parentId;
    setParentId(parent ? parent : null);
  };

  return (
    <VStack gap="6" align="stretch">
      <HStack flexWrap="wrap" justify="space-between" align="start">
        <Box>
          <Heading size="lg" color="fg.emphasized">
            Egresos
          </Heading>
          <Text color="fg.muted" mt="1">
            Controla todos los gastos y egresos del proyecto
          </Text>
        </Box>
        <HStack gap="3" flexWrap="wrap" width={{ base: "100%", md: "auto" }}>
          <Box width={{ base: "30rem", md: "auto" }}>
            <NativeSelectRoot
              display="flex"
              alignItems="center"
              flexDirection={{ base: "column", md: "row" }}
              gap={{ base: "3", md: "2" }}
            >
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
              <Button
                w={{ base: "100%", md: "auto" }}
                colorScheme="blue"
                paddingInline="1rem"
                onClick={() => {
                  setFormDefaults(formDefaultsValues);
                  setFormMode("create");
                  setOpen(true);
                }}
              >
                <IoMdAdd />
                Nuevo egreso
              </Button>
            </NativeSelectRoot>
          </Box>
          <FormExpenses
            defaultValues={formDefaults}
            mode={formMode}
            open={open}
            setOpen={setOpen}
            refreshDashboard={refreshDashboard}
            projects={projects}
          />
        </HStack>
      </HStack>
      <Box>
        <HStack gap={{ base: "3", md: "4" }} flexWrap="wrap">
          <VStack
            align="start"
            bg="bg.panel"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.subtle"
            boxShadow="sm"
            px={{ base: "4", md: "6" }}
            py={{ base: "3", md: "4" }}
            flex={{
              base: "1 1 100%",
              sm: "1 1 calc(50% - 0.75rem)",
              lg: "1 1 calc(33.333% - 1rem)",
            }}
            minW={{ base: "full", sm: "200px" }}
          >
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="fg.muted"
              fontWeight="bold"
            >
              Total Egresos
            </Text>
            <HStack>
              <FiTrendingDown color="red" />
              <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                fontWeight="bold"
                color="red.500"
              >
                {formatNumber(totalEgresos)}
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
            px={{ base: "4", md: "6" }}
            py={{ base: "3", md: "4" }}
            flex={{
              base: "1 1 100%",
              sm: "1 1 calc(50% - 0.75rem)",
              lg: "1 1 calc(33.333% - 1rem)",
            }}
            minW={{ base: "full", sm: "200px" }}
          >
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="fg.muted"
              fontWeight="bold"
            >
              Activos Corrientes
            </Text>
            <HStack>
              <FiTrendingUp color="green" />
              <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                fontWeight="semibold"
                color="green.500"
              >
                {formatNumber(totalCurrentAssets)}
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
            px={{ base: "4", md: "6" }}
            py={{ base: "3", md: "4" }}
            flex={{
              base: "1 1 100%",
              sm: "1 1 calc(50% - 0.75rem)",
              lg: "1 1 calc(33.333% - 1rem)",
            }}
            minW={{ base: "full", sm: "200px" }}
          >
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="fg.muted"
              fontWeight="bold"
            >
              Activos No Corrientes
            </Text>
            <HStack>
              <FiTrendingDown color="blue" />
              <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                fontWeight="semibold"
                color="blue.500"
              >
                {formatNumber(totalNonCurrentAssets)}
              </Text>
            </HStack>
          </VStack>
        </HStack>
      </Box>
      {/* Egresos List */}
      <VStack gap="3" align="stretch">
        {filteredExpenses.map((exp) => (
          <Box
            key={exp.id}
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
                  {exp.expense}
                </Text>
                <Text color="fg.muted" fontSize="xs">
                  {exp.description}
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
                    {exp.concept_name}
                  </Text>
                  <Text color="fg.muted" fontSize="sm">
                    {exp.type_expense}
                  </Text>
                  <Text color="fg.muted" fontSize="sm">
                    {exp.type}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" color="fg.muted">
                    {formatDateShort(exp.expense_date)}
                  </Text>
                </HStack>
              </VStack>
              <VStack align="start" gap="1" minWidth="8rem" paddingRight="1rem">
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={getColorType(exp.type)}
                >
                  {formatNumber(exp.total_price)}
                </Text>
                <Badge colorPalette="blue" size="sm" fontWeight="bold">
                  {exp.project_name}
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
                      {exp.status === "ACTIVE" && (
                        <>
                          <MenuItem
                            value="edit"
                            onClick={() => {
                              setFormDefaults(transformData(exp));
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
                              deleteExpenseById(exp.id);
                            }}
                          >
                            <FiTrash2 />
                            Eliminar
                          </MenuItem>
                        </>
                      )}
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
