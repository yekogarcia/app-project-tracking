import {
  Box,
  Heading,
  Text,
  Button,
  Badge,
  HStack,
  VStack,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  Input,
  NativeSelectRoot,
  NativeSelectField,
  IconButton,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from "@chakra-ui/react";

import { useDisclosure } from "../../../app/hooks/useDisclosure";
import {
  FiPlus,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiTrendingUp,
} from "react-icons/fi";
import { useState } from "react";

interface Ingreso {
  id: string;
  concepto: string;
  monto: number;
  fecha: string;
  proyectoId: string;
  proyectoNombre: string;
  subproyectoId?: string;
  subproyectoNombre?: string;
  estado: "pendiente" | "completado" | "cancelado";
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
      { id: "1-2", nombre: "Backend API" }
    ]
  },
  { 
    id: "2", 
    nombre: "Mobile App",
    subproyectos: [
      { id: "2-1", nombre: "iOS App" },
      { id: "2-2", nombre: "Android App" }
    ]
  },
  { 
    id: "3", 
    nombre: "Dashboard Analytics",
    subproyectos: []
  },
];

const mockIngresos: Ingreso[] = [
  {
    id: "1",
    concepto: "Pago inicial del proyecto",
    monto: 7500,
    fecha: "2024-01-15",
    proyectoId: "1",
    proyectoNombre: "E-commerce Platform",
    estado: "completado",
  },
  {
    id: "2",
    concepto: "Milestone 1 completado",
    monto: 4000,
    fecha: "2024-01-10",
    proyectoId: "2",
    proyectoNombre: "Mobile App",
    estado: "completado",
  },
  {
    id: "3",
    concepto: "Pago por consultoría",
    monto: 2400,
    fecha: "2024-01-08",
    proyectoId: "3",
    proyectoNombre: "Dashboard Analytics",
    estado: "pendiente",
  },
];

export function IngresosPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ingresos, setIngresos] = useState<Ingreso[]>(mockIngresos);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [formData, setFormData] = useState({
    concepto: "",
    monto: "",
    proyectoId: "",
    subproyectoId: "",
    estado: "pendiente" as const,
  });

  const selectedProyectoData = mockProyectos.find(p => p.id === formData.proyectoId);

  const handleSubmit = () => {
    const selectedProject = mockProyectos.find(
      (p) => p.id === formData.proyectoId
    );
    const selectedSubproject = selectedProject?.subproyectos?.find(
      (s) => s.id === formData.subproyectoId
    );

    const nuevoIngreso: Ingreso = {
      id: Date.now().toString(),
      concepto: formData.concepto,
      monto: parseFloat(formData.monto),
      fecha: new Date().toISOString().split("T")[0],
      proyectoId: formData.proyectoId,
      proyectoNombre: selectedProject?.nombre || "",
      subproyectoId: formData.subproyectoId || undefined,
      subproyectoNombre: selectedSubproject?.nombre || undefined,
      estado: formData.estado,
    };

    setIngresos([nuevoIngreso, ...ingresos]);
    setFormData({
      concepto: "",
      monto: "",
      proyectoId: "",
      subproyectoId: "",
      estado: "pendiente",
    });
    onClose();
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      completado: "green",
      pendiente: "yellow",
      cancelado: "red",
    };
    return (
      <Badge colorScheme={colors[estado as keyof typeof colors]}>
        {estado}
      </Badge>
    );
  };

  // Filter ingresos by selected project
  const filteredIngresos = selectedProject
    ? ingresos.filter((ingreso) => ingreso.proyectoId === selectedProject)
    : ingresos;

  const totalIngresos = filteredIngresos.reduce(
    (sum, ingreso) => sum + ingreso.monto,
    0
  );

  return (
    <VStack gap="6" align="stretch">
      {/* Header */}
      <HStack justify="space-between" align="start">
        <Box>
          <Heading size="lg" color="fg.emphasized">
            Ingresos
          </Heading>
          <Text color="fg.muted" mt="1">
            Gestiona todos los ingresos de tus proyectos
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
            </NativeSelectRoot>
          </Box>
          <DialogRoot
            open={isOpen}
            onOpenChange={({ open }) => (open ? onOpen() : onClose())}
          >
            <DialogTrigger asChild>
              <Button colorScheme="green">
                <FiPlus />
                Nuevo Ingreso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Ingreso</DialogTitle>
                <DialogCloseTrigger />
              </DialogHeader>
              <DialogBody>
                <VStack gap="4">
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">
                      Concepto
                    </Text>
                    <Input
                      value={formData.concepto}
                      onChange={(e) =>
                        setFormData({ ...formData, concepto: e.target.value })
                      }
                      placeholder="Descripción del ingreso"
                    />
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">
                      Monto
                    </Text>
                    <Input
                      type="number"
                      value={formData.monto}
                      onChange={(e) =>
                        setFormData({ ...formData, monto: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">
                      Proyecto
                    </Text>
                    <NativeSelectRoot>
                      <NativeSelectField
                        value={formData.proyectoId}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            proyectoId: e.target.value,
                            subproyectoId: "", // Reset subproject when project changes
                          });
                        }}
                      >
                        <option value="">Selecciona un proyecto</option>
                        {mockProyectos.map((proyecto) => (
                          <option key={proyecto.id} value={proyecto.id}>
                            {proyecto.nombre}
                          </option>
                        ))}
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </Box>

                  {/* Subproyecto selector - only show if project has subprojects */}
                  {formData.proyectoId && selectedProyectoData && selectedProyectoData.subproyectos && selectedProyectoData.subproyectos.length > 0 && (
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb="2">
                        Subproyecto (Opcional)
                      </Text>
                      <NativeSelectRoot>
                        <NativeSelectField
                          value={formData.subproyectoId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subproyectoId: e.target.value,
                            })
                          }
                        >
                          <option value="">Proyecto principal</option>
                          {selectedProyectoData.subproyectos.map((subproyecto) => (
                            <option key={subproyecto.id} value={subproyecto.id}>
                              {subproyecto.nombre}
                            </option>
                          ))}
                        </NativeSelectField>
                      </NativeSelectRoot>
                    </Box>
                  )}

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">
                      Estado
                    </Text>
                    <NativeSelectRoot>
                      <NativeSelectField
                        value={formData.estado}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estado: e.target.value as any,
                          })
                        }
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="completado">Completado</option>
                        <option value="cancelado">Cancelado</option>
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </Box>
                </VStack>
              </DialogBody>

              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button colorScheme="green" onClick={handleSubmit}>
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
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
              Total Ingresos
            </Text>
            <HStack>
              <FiTrendingUp color="green" />
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                ${totalIngresos.toLocaleString()}
              </Text>
            </HStack>
          </VStack>
          <VStack align="start">
            <Text fontSize="sm" color="fg.muted">
              Este Mes
            </Text>
            <Text fontSize="xl" fontWeight="semibold">
              ${(totalIngresos * 0.3).toLocaleString()}
            </Text>
          </VStack>
          <VStack align="start">
            <Text fontSize="sm" color="fg.muted">
              Pendientes
            </Text>
            <Text fontSize="xl" fontWeight="semibold">
              {filteredIngresos.filter((i) => i.estado === "pendiente").length}
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Ingresos List */}
      <Box
        bg="bg.panel"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border.subtle"
        p="6"
      >
        <VStack gap="4" align="stretch">
          {filteredIngresos.map((ingreso) => (
            <Box
              key={ingreso.id}
              bg="bg.canvas"
              borderRadius="md"
              borderWidth="1px"
              borderColor="border.subtle"
              p="4"
            >
              <HStack justify="space-between" align="start">
                <VStack align="start" gap="1" flex="1">
                  <Text fontWeight="medium" fontSize="lg">
                    {ingreso.concepto}
                  </Text>
                  <HStack gap="2">
                    <Text color="fg.muted" fontSize="sm">
                      {ingreso.proyectoNombre}
                    </Text>
                    {ingreso.subproyectoNombre && (
                      <>
                        <Text color="fg.muted" fontSize="sm">→</Text>
                        <Badge colorScheme="blue" size="sm">
                          {ingreso.subproyectoNombre}
                        </Badge>
                      </>
                    )}
                  </HStack>
                  <Text fontSize="sm" color="fg.muted">
                    {new Date(ingreso.fecha).toLocaleDateString()}
                  </Text>
                </VStack>
                <VStack align="end" gap="2">
                  <Text fontSize="xl" fontWeight="bold" color="green.500">
                    ${ingreso.monto.toLocaleString()}
                  </Text>
                  <HStack>
                    {getEstadoBadge(ingreso.estado)}
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
