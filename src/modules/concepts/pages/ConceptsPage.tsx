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

import { FiMoreVertical, FiEdit, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { showToaster } from "@/app/utils/utils";
import { projectsService } from "@/services/projects/ProjectsService";
import type { ISelect } from "@/app";
import { FormConcepts } from "../components/FormConcepts";
import { conceptsService } from "@/services/concepts/conceptsService";

const formDefaultsValues = {
  concept: "",
  status: "ACTIVO",
  view: "",
  description: "",
  projectId: undefined,
};

export function ConceptsPage() {
  const [concepts, setConcepts] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [formDefaults, setFormDefaults] = useState<any>(formDefaultsValues);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [projects, setProjects] = useState<ISelect[]>([]);

  useEffect(() => {
    getAllConcepts();
    getProjects();
  }, []);

  const refreshDashboard = () => {
    getAllConcepts();
  };

  const getAllConcepts = async () => {
    const resp = await conceptsService.getConcepts();
    if (resp.statusCode === 200) {
      setConcepts(resp.data);
    } else {
      showToaster({
        type: "warning",
        description: resp.message || "No se pudo cargar los conceptos",
      });
    }
  };

  const transformData = (concept: any) => {
    return {
      id: concept.id,
      concept: concept.concept,
      status: concept.status,
      view: concept.view,
      projectId: concept.project_id,
      description: concept.description,
    };
  };

  const deleteConceptById = async (id: any) => {
    const resp = await conceptsService.deleteConcept(id);
    if (resp.statusCode === 200) {
      showToaster({
        type: "success",
        description: "Concepto eliminado exitosamente",
      });
    } else {
      showToaster({
        type: "warning",
        description: resp.message || "No se pudo eliminar el concepto",
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
          response.message || "Error al cargar los proyectos de concepto",
        duration: 3000,
      });
    }
  };

  // Filter conceptos by selected project
  const filteredConcepts = selectedProject
    ? concepts.filter((concept) => concept.project_id == selectedProject)
    : concepts;

  return (
    <VStack gap="6" align="stretch">
      <HStack flexWrap="wrap" justify="space-between" align="start">
        <Box>
          <Heading size="lg" color="fg.emphasized">
            Conceptos
          </Heading>
          <Text color="fg.muted" mt="1">
            Gestiona todos los conceptos de tus costos, gastos y activos
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
                onChange={(e) => setSelectedProject(e.target.value)}
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
                <IoMdAdd style={{ marginRight: 8 }} />
                Nuevo concepto
              </Button>
            </NativeSelectRoot>
          </Box>
          <FormConcepts
            defaultValues={formDefaults}
            mode={formMode}
            open={open}
            setOpen={setOpen}
            refreshDashboard={refreshDashboard}
            projects={projects}
          />
        </HStack>
      </HStack>

      {/* Conceptos List */}
      <VStack gap="3" align="stretch">
        {filteredConcepts.map((concept) => (
          <Box
            key={concept.id}
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
                  {concept.concept}
                </Text>
                <Text color="fg.muted" fontSize="xs">
                  {concept.description}
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
                    {concept.status}
                  </Text>
                  <Text color="fg.muted" fontSize="sm">
                    {concept.view}
                  </Text>
                </HStack>
              </VStack>
              <VStack align="start" gap="1" minWidth="8rem" paddingRight="1rem">
                <Badge colorPalette="blue" size="sm" fontWeight="bold">
                  {concept.project_name}
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
                          setFormDefaults(transformData(concept));
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
                          deleteConceptById(concept.id);
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
