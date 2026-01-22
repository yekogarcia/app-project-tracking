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
  FiFolderPlus,
} from "react-icons/fi";
import { useState } from "react";
import { FormExpenses } from "../components/FormExpenses";

interface Egreso {
  id: string;
  concepto: string;
  monto: number;
  fecha: string;
  categoria: string;
  proyectoId: string;
  proyectoNombre: string;
  subproyectoId?: string;
  subproyectoNombre?: string;
  estado: "pendiente" | "pagado" | "cancelado";
}

interface Subproyecto {
  id: string;
  nombre: string;
}

interface Proyecto {
  id: string;
  nombre: string;
  subproyectos?: Subproyecto[];
}

// Mock projects data (should match ProyectosPage)
const mockProyectos: Proyecto[] = [
  {
    id: "1",
    nombre: "E-commerce Platform",
    subproyectos: [
      { id: "1-1", nombre: "Frontend" },
      { id: "1-2", nombre: "Backend API" },
    ],
  },
  {
    id: "2",
    nombre: "Mobile App",
    subproyectos: [
      { id: "2-1", nombre: "iOS App" },
      { id: "2-2", nombre: "Android App" },
    ],
  },
  {
    id: "3",
    nombre: "Dashboard Analytics",
    subproyectos: [],
  },
];

const mockEgresos: Egreso[] = [
  {
    id: "1",
    concepto: "Hosting mensual",
    monto: 450,
    fecha: "2024-01-15",
    categoria: "Infraestructura",
    proyectoId: "1",
    proyectoNombre: "E-commerce Platform",
    estado: "pagado",
  },
  {
    id: "2",
    concepto: "Licencias software",
    monto: 299,
    fecha: "2024-01-12",
    categoria: "Software",
    proyectoId: "2",
    proyectoNombre: "Mobile App",
    estado: "pagado",
  },
  {
    id: "3",
    concepto: "Freelancer diseño",
    monto: 800,
    fecha: "2024-01-10",
    categoria: "Servicios",
    proyectoId: "3",
    proyectoNombre: "Dashboard Analytics",
    estado: "pendiente",
  },
];

const formDefaultsValues = {
  typeExpense: "COSTO",
  concept: undefined,
  type: "",
  quantity: 1,
  price: 0,
  totalPrice: 0,   
  description: "",
  projectId: "",
};

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Egreso[]>(mockEgresos);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [formDefaults, setFormDefaults] = useState<any>(formDefaultsValues);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");


//   const selectedProyectoData = mockProyectos.find(
//     (p) => p.id === formData.proyectoId
//   );

//   const handleSubmit = () => {
//     const selectedProject = mockProyectos.find(
//       (p) => p.id === formData.proyectoId
//     );
//     const selectedSubproject = selectedProject?.subproyectos?.find(
//       (s) => s.id === formData.subproyectoId
//     );

//     const nuevoEgreso: Egreso = {
//       id: Date.now().toString(),
//       concepto: formData.concepto,
//       monto: parseFloat(formData.monto),
//       fecha: new Date().toISOString().split("T")[0],
//       categoria: formData.categoria,
//       proyectoId: formData.proyectoId,
//       proyectoNombre: selectedProject?.nombre || "",
//       subproyectoId: formData.subproyectoId || undefined,
//       subproyectoNombre: selectedSubproject?.nombre || undefined,
//       estado: formData.estado,
//     };

//     setEgresos([nuevoEgreso, ...egresos]);
//     setFormData({
//       concepto: "",
//       monto: "",
//       categoria: "",
//       proyectoId: "",
//       subproyectoId: "",
//       estado: "pendiente",
//     });
//     onClose();
//   };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      pagado: "green",
      pendiente: "yellow",
      cancelado: "red",
    };
    return (
      <Badge colorScheme={colors[estado as keyof typeof colors]}>
        {estado}
      </Badge>
    );
  };

  // Filter egresos by selected project
  const filteredEgresos = selectedProject
    ? expenses.filter((expense) => expense.proyectoId === selectedProject)
    : expenses;

  const totalEgresos = filteredEgresos.reduce(
    (sum, egreso) => sum + egreso.monto,
    0
  );

  return (
    <VStack gap="6" align="stretch">
      {/* Header */}
      <HStack justify="space-between" align="start">
        <Box>
          <Heading size="lg" color="fg.emphasized">
            Egresos
          </Heading>
          <Text color="fg.muted" mt="1">
            Controla todos los gastos y egresos del proyecto
          </Text>
        </Box>
        <HStack gap="3">
          <Box minW="200px">
            <NativeSelectRoot>
              <NativeSelectField
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                placeholder="Filtrar por proyecto"
              >
                <option value="">Todos los proyectos</option>
                {mockProyectos.map((proyecto) => (
                  <option key={proyecto.id} value={proyecto.id}>
                    {proyecto.nombre}
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
                <FiFolderPlus style={{ marginRight: 8 }} />
                Nuevo egreso
              </Button>
            </NativeSelectRoot>
          </Box>
          <FormExpenses
            defaultValues={formDefaults}
            mode={formMode}
            open={open}
            setOpen={setOpen}
            refreshDashboard={() => {}}
          />
        </HStack>
      </HStack>

      {/* Stats */}
      <Box
        bg="bg.panel"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border.subtle"
        p="6"
      >
        <HStack gap="8">
          <VStack align="start">
            <Text fontSize="sm" color="fg.muted">
              Total Egresos
            </Text>
            <HStack>
              <FiTrendingDown color="red" />
              <Text fontSize="2xl" fontWeight="bold" color="red.500">
                ${totalEgresos.toLocaleString()}
              </Text>
            </HStack>
          </VStack>
          <VStack align="start">
            <Text fontSize="sm" color="fg.muted">
              Este Mes
            </Text>
            <Text fontSize="xl" fontWeight="semibold">
              ${(totalEgresos * 0.4).toLocaleString()}
            </Text>
          </VStack>
          <VStack align="start">
            <Text fontSize="sm" color="fg.muted">
              Pendientes
            </Text>
            <Text fontSize="xl" fontWeight="semibold">
              {filteredEgresos.filter((e) => e.estado === "pendiente").length}
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Egresos List */}
      <Box
        bg="bg.panel"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border.subtle"
        p="6"
      >
        <VStack gap="4" align="stretch">
          {filteredEgresos.map((egreso) => (
            <Box
              key={egreso.id}
              bg="bg.canvas"
              borderRadius="md"
              borderWidth="1px"
              borderColor="border.subtle"
              p="4"
            >
              <HStack justify="space-between" align="start">
                <VStack align="start" gap="1" flex="1">
                  <Text fontWeight="medium" fontSize="lg">
                    {egreso.concepto}
                  </Text>
                  <HStack gap="2">
                    <Text color="fg.muted" fontSize="sm">
                      {egreso.proyectoNombre}
                    </Text>
                    {egreso.subproyectoNombre && (
                      <>
                        <Text color="fg.muted" fontSize="sm">
                          →
                        </Text>
                        <Badge colorScheme="blue" size="sm">
                          {egreso.subproyectoNombre}
                        </Badge>
                      </>
                    )}
                    <Text color="fg.muted" fontSize="sm">
                      •
                    </Text>
                    <Text color="fg.muted" fontSize="sm">
                      {egreso.categoria}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="fg.muted">
                    {new Date(egreso.fecha).toLocaleDateString()}
                  </Text>
                </VStack>
                <VStack align="end" gap="2">
                  <Text fontSize="xl" fontWeight="bold" color="red.500">
                    -${egreso.monto.toLocaleString()}
                  </Text>
                  <HStack>
                    {getEstadoBadge(egreso.estado)}
                    <MenuRoot>
                      <MenuTrigger asChild>
                        <IconButton variant="ghost" size="sm">
                          <FiMoreVertical />
                        </IconButton>
                      </MenuTrigger>
                      <MenuContent>
                        <MenuItem value="edit">
                          <FiEdit />
                          Editar
                        </MenuItem>
                        <MenuItem value="delete" color="fg.error">
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
      </Box>
    </VStack>
  );
}
