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
import { ResponsiveLayout } from "../../../app/components/layout/ResponsiveLayout";
import { useDisclosure } from "../../../app/hooks/useDisclosure";
import {
  FiPlus,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiTrendingDown,
} from "react-icons/fi";
import { useState } from "react";

interface Egreso {
  id: string;
  concepto: string;
  monto: number;
  fecha: string;
  categoria: string;
  proyectoId: string;
  proyectoNombre: string;
  estado: "pendiente" | "pagado" | "cancelado";
}

// Mock projects data (should match ProyectosPage)
const mockProyectos = [
  { id: "1", nombre: "E-commerce Platform" },
  { id: "2", nombre: "Mobile App" },
  { id: "3", nombre: "Dashboard Analytics" },
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

export function EgresosPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [egresos, setEgresos] = useState<Egreso[]>(mockEgresos);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [formData, setFormData] = useState({
    concepto: "",
    monto: "",
    categoria: "",
    proyectoId: "",
    estado: "pendiente" as const,
  });

  const handleSubmit = () => {
    const selectedProject = mockProyectos.find(
      (p) => p.id === formData.proyectoId
    );

    const nuevoEgreso: Egreso = {
      id: Date.now().toString(),
      concepto: formData.concepto,
      monto: parseFloat(formData.monto),
      fecha: new Date().toISOString().split("T")[0],
      categoria: formData.categoria,
      proyectoId: formData.proyectoId,
      proyectoNombre: selectedProject?.nombre || "",
      estado: formData.estado,
    };

    setEgresos([nuevoEgreso, ...egresos]);
    setFormData({
      concepto: "",
      monto: "",
      categoria: "",
      proyectoId: "",
      estado: "pendiente",
    });
    onClose();
  };

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
    ? egresos.filter((egreso) => egreso.proyectoId === selectedProject)
    : egresos;

  const totalEgresos = filteredEgresos.reduce(
    (sum, egreso) => sum + egreso.monto,
    0
  );

  return (
    <ResponsiveLayout variant="admin">
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
              </NativeSelectRoot>
            </Box>
            <DialogRoot
              open={isOpen}
              onOpenChange={({ open }) => (open ? onOpen() : onClose())}
            >
              <DialogTrigger asChild>
                <Button colorScheme="red">
                  <FiPlus />
                  Nuevo Egreso
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuevo Egreso</DialogTitle>
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
                        placeholder="Descripción del egreso"
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              proyectoId: e.target.value,
                            })
                          }
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

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb="2">
                        Categoría
                      </Text>
                      <NativeSelectRoot>
                        <NativeSelectField
                          value={formData.categoria}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              categoria: e.target.value,
                            })
                          }
                        >
                          <option value="">Selecciona una categoría</option>
                          <option value="Infraestructura">
                            Infraestructura
                          </option>
                          <option value="Software">Software</option>
                          <option value="Servicios">Servicios</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Oficina">Oficina</option>
                        </NativeSelectField>
                      </NativeSelectRoot>
                    </Box>

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
                          <option value="pagado">Pagado</option>
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
                  <Button colorScheme="red" onClick={handleSubmit}>
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
                    <Text color="fg.muted" fontSize="sm">
                      {egreso.proyectoNombre} • {egreso.categoria}
                    </Text>
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
    </ResponsiveLayout>
  );
}
