import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  Badge,
  HStack,
  VStack,
  IconButton,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from "@chakra-ui/react";

// import { useDisclosure } from "../../../app/hooks/useDisclosure";
import {
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiFolderPlus,
  FiCalendar,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { Toaster } from "@/app/components/ux/toaster";

import { useEffect, useState } from "react";
import FormProjects from "../components/FormProjects";
import { projectsService } from "@/services/projects/ProjectsService";
import { formatDateShort, showToaster } from "@/app/utils/utils";

interface Subproyecto {
  id: string;
  nombre: string;
  descripcion: string;
  progreso: number;
  presupuesto: number;
  fechaInicio: string;
  fechaFin: string;
  estado: "activo" | "completado" | "pausado" | "cancelado";
}

interface Projects {
  id: number;
  name: string;
  description: string;
  type: "PROJECT" | "SUBPROJECT";
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "SUSPENDED" | "RUNNING" | "CANCELED" | "COMPLETED";
  parentId?: number;
  parentName: string;
  subproyectos?: Subproyecto[];
}

const formDefaultsValues = {
  type: "PROJECT",
  parentId: undefined,
  name: "",
  status: "ACTIVE",
  description: "",
  startDate: "",
  endDate: "",
};

export function ProyectosPage() {
  const [projects, setProjects] = useState<Projects[]>([]);
  // const [selectedProyecto, setSelectedProyecto] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(
    new Set()
  );
  const [totals, setTotals] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [formDefaults, setFormDefaults] = useState<any>(formDefaultsValues);

  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    refreshDashboard();
  }, []);

  const refreshDashboard = () => {
    totalsProjects();
    getProjects();
  };

  const totalsProjects = async () => {
    const totalsProjects = await projectsService.getTotalProjects();
    setTotals(totalsProjects.data);
  };

  const getProjects = async () => {
    const projects = await projectsService.getAllProjects();
    console.log(projects);
    
    setProjects(projects.data);
  };

  const toggleProjectExpansion = (projectId: number) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      ACTIVE: "blue",
      COMPLETED: "green",
      RUNNING: "yellow",
      SUSPENDED: "gray",
      CANCELLED: "red",
    };
    return (
      <Badge colorPalette={colors[estado as keyof typeof colors]}>
        {/* <Badge colorPalette="blue"> */}
        {estado}
      </Badge>
    );
  };

  const deleteProjectById = async (projectId: number) => {
    const resp = await projectsService.deleteProject(projectId);
    if (resp.statusCode === 200) {
      showToaster({
        type: "success",
        description: "Proyecto eliminado exitosamente",
      });
    } else {
      showToaster({
        type: "warning",
        description: resp.message || "No se pudo eliminar el proyecto",
      });
    }
    await refreshDashboard();
  };

  return (
    <VStack gap="6" align="stretch">
      {/* Header */}
      <Toaster />
      <HStack justify="space-between" align="start">
        <Box>
          <Heading size="lg" color="fg.emphasized">
            Proyectos
          </Heading>
          <Text color="fg.muted" mt="1">
            Gestiona todos tus proyectos y su progreso
          </Text>
        </Box>
        <Button
          colorScheme="blue"
          onClick={() => {
            // prepare create defaults and open dialog clean
            setFormDefaults(formDefaultsValues);
            setFormMode("create");
            setOpen(true);
          }}
        >
          <FiFolderPlus style={{ marginRight: 8 }} />
          Nuevo Proyecto
        </Button>
        <FormProjects
          defaultValues={formDefaults}
          mode={formMode}
          open={open}
          setOpen={setOpen}
          refreshDashboard={refreshDashboard}
        />
      </HStack>

      {/* Stats */}
      <Grid
        // Columns adaptativas, tarjetas más compactas (min width 180px)
        templateColumns={{
          base: "1fr",
          md: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
        gap="4"
      >
        <Box
          bg="bg.panel"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="border.subtle"
          p="4"
        >
          <HStack>
            <FiFolderPlus size="18" color="blue" />
            <VStack align="start" gap="0">
              <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                Total Proyectos
              </Text>
              <Text fontSize="xl" fontWeight="bold">
                {totals?.TOTAL || 0}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box
          bg="bg.panel"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="border.subtle"
          p="4"
        >
          <HStack>
            <FiCalendar size="18" color="blue" />
            <VStack align="start" gap="0">
              <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                Activos
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="blue.500">
                {totals?.ACTIVE || 0}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box
          bg="bg.panel"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="border.subtle"
          p="4"
        >
          <HStack>
            <FiCalendar size="18" color="orange" />
            <VStack align="start" gap="0">
              <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                En ejecución
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="orange.500">
                {totals?.RUNNING || 0}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box
          bg="bg.panel"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="border.subtle"
          p="4"
        >
          <HStack>
            <FiCalendar size="18" color="gray" />
            <VStack align="start" gap="0">
              <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                Suspendidos
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="gray.500">
                {totals?.SUSPENDED || 0}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box
          bg="bg.panel"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="border.subtle"
          p="4"
        >
          <HStack>
            <FiCalendar size="24" color="red" />
            <VStack align="start" gap="0">
              <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                Cancelados
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="red.500">
                {totals?.CANCELLED || 0}
              </Text>
            </VStack>
          </HStack>
        </Box>
        <Box
          bg="bg.panel"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="border.subtle"
          p="4"
        >
          <HStack>
            <FiCalendar size="18" color="green" />
            <VStack align="start" gap="0">
              <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                Completados
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="green.500">
                {totals?.COMPLETED || 0}
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* <Box
          bg="bg.panel"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="border.subtle"
          p="4"
        >
          <HStack>
            <FiDollarSign size="18" color="purple" />
            <VStack align="start" gap="0">
              <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                Presupuesto Total
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="purple.500">
                ${totalPresupuesto.toLocaleString()}
              </Text>
            </VStack>
          </HStack>
        </Box> */}
      </Grid>

      {/* Projects Grid */}
      <Grid
        // Use auto-fit to adjust number of columns automatically and keep cards compact
        templateColumns={{
          base: "1fr",
          md: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
        //  templateColumns={{
        //   base: "1fr",
        //   md: "repeat(auto-fit, minmax(180px, 1fr))",
        // }}
        gap="4"
      >
        {projects.map((project) => (
          <Box
            key={project.id}
            bg="bg.panel"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.subtle"
            p="4"
          >
            <VStack align="stretch" gap="4">
              <HStack justify="space-between">
                <Heading size="sm" lineClamp={1}>
                  {project.name}
                </Heading>
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
                        // ensure dates are provided in YYYY-MM-DD format for input[type=date]
                        const formatDate = (d: any) => {
                          try {
                            if (!d) return "";
                            const dt = new Date(d);
                            if (isNaN(dt.getTime())) return "";
                            return dt.toISOString().slice(0, 10);
                          } catch (e) {
                            return "";
                          }
                        };

                        setFormDefaults({
                          id: project.id,
                          type: project.type || "PROJECT",
                          parentId: project.parentId || undefined,
                          name: project.name,
                          status: project.status,
                          description: project.description,
                          startDate: formatDate(project.startDate),
                          endDate: formatDate(project.endDate),
                        });
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
                        // Implement delete functionality here
                        console.log("Delete project", project.id);
                        if (project.status == "ACTIVE") {
                          deleteProjectById(project.id);
                        } else {
                          showToaster({
                            type: "warning",
                            description:
                              "El proyecto se puede eliminar solo en estado ACTIVE",
                          });
                        }
                      }}
                    >
                      <FiTrash2 />
                      Eliminar
                    </MenuItem>
                  </MenuContent>
                </MenuRoot>
              </HStack>

              <Text fontSize="xs" color="fg.muted" lineClamp={2}>
                {project.description}
              </Text>

              <HStack justify="space-between">
                <VStack align="start" gap="0">
                  <Text fontSize="xs" color="fg.muted">
                    Tipo
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {project.type}
                  </Text>
                </VStack>
                <VStack align="end" gap="0">
                  <Text fontSize="xs" color="fg.muted">
                    Proyecto principal:
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color="green.500">
                    {project.parentName ? project.parentName : "N/A"}
                  </Text>
                </VStack>
              </HStack>

              <HStack justify="space-between">
                <Text fontSize="xx-small" color="fg.muted">
                  {formatDateShort(project.startDate)}
                  {project?.endDate ? ` - ${formatDateShort(project.endDate)}` : ""}
                </Text>
                {getEstadoBadge(project.status)}
              </HStack>

              {/* Subproyectos Section */}
              {project.subproyectos && project.subproyectos.length > 0 && (
                <Box borderTopWidth="1px" borderColor="border.subtle" pt="3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleProjectExpansion(project.id)}
                    width="full"
                    justifyContent="space-between"
                  >
                    <HStack>
                      <FiFolderPlus size="12" />
                      <Text fontSize="xs">
                        Subproyectos ({project.subproyectos.length})
                      </Text>
                    </HStack>
                    {expandedProjects.has(project.id) ? (
                      <FiChevronDown />
                    ) : (
                      <FiChevronRight />
                    )}
                  </Button>

                  {expandedProjects.has(project.id) && (
                    <VStack align="stretch" gap="2" mt="2">
                      {project.subproyectos.map((sub) => (
                        <Box
                          key={sub.id}
                          bg={{ base: "gray.50", _dark: "gray.700" }}
                          borderRadius="md"
                          p="3"
                        >
                          <VStack align="stretch" gap="2">
                            <HStack justify="space-between">
                              <Text fontSize="sm" fontWeight="medium">
                                {sub.nombre}
                              </Text>
                              {getEstadoBadge(sub.estado)}
                            </HStack>
                            <Text fontSize="xs" color="fg.muted" lineClamp={1}>
                              {sub.descripcion}
                            </Text>
                            <HStack justify="space-between">
                              <Text fontSize="xs" color="fg.muted">
                                Progreso: {sub.progreso}%
                              </Text>
                              <Text
                                fontSize="xs"
                                fontWeight="bold"
                                color="green.500"
                              >
                                ${sub.presupuesto.toLocaleString()}
                              </Text>
                            </HStack>
                          </VStack>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              )}
            </VStack>
          </Box>
        ))}
      </Grid>
    </VStack>
  );
}
