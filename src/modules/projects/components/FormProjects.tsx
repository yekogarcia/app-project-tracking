import {
  Form,
  InputField,
  SelectField,
  TextAreaField,
} from "@/app/components/ui/forms";
import {
  Button,
  CloseButton,
  Dialog,
  Grid,
  GridItem,
  Portal,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
// import { createToaster } from "@chakra-ui/react";
import { Toaster, toaster } from "@/app/components/ux/toaster";

import {
  projectsSchema,
  type ProjectsFormData,
} from "../schemas/schemaProject";
// import { ProjectsService } from "@/services/projects/ProjectsService";

import { projectsService } from "@/services/projects/ProjectsService";
import { useAuthStore } from "@/modules/auth/store/auth.store";

interface IFormProps {
  defaultValues?: Partial<ProjectsFormData>;
  /** 📝 Modo del formulario: 'create' | 'edit' */
  mode?: "create" | "edit";
}

const FormProjects = ({
  defaultValues: propDefaultValues,
  mode = "create",
}: IFormProps) => {
  //   const { onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState<"PROJECT" | "SUBPROJECT" | "">("PROJECT");
  const [projects, setProjects] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [required, setRequired] = useState(false);

  const { account } = useAuthStore();

  const baseDefaultValues: Partial<ProjectsFormData> = {
    type: "PROJECT",
    parentId: undefined,
    name: "",
    status: "ACTIVE",
    description: "",
  };

  // 🔄 Mergear valores por defecto base con los proporcionados
  const mergedDefaultValues = useMemo(
    () => ({
      ...baseDefaultValues,
      ...propDefaultValues,
    }),
    [propDefaultValues]
  );

  const form = useForm<ProjectsFormData>({
    resolver: zodResolver(projectsSchema),
    defaultValues: mergedDefaultValues,
  });

  const onChangeType = async () => {
    const values = form.getValues();
    if (values.type === "SUBPROJECT") {
      const { data, message } = await projectsService.getProjects("PROJECT");
      if (data.length > 0) {
        setRequired(true);
        setType(values.type);
        setProjects(data);
      } else {
        form.setValue("type", "PROJECT");
        setType("PROJECT");
        setRequired(false);
        showToaster({
          type: "error",
          description: message || "No se pudieron cargar los proyectos",
          duration: 6000,
        });
      }
    } else {
      setType(values.type);
      setRequired(false);
    }
  };

  const handleSubmit = async (data: any) => {
    data.companyId = account.company.id;
    data.userId = account.id;
    setIsSubmitting(true);

    console.log(data);
    

    const response = await projectsService.saveProject(data);
    console.log(response);
    
    if (response.statusCode === 200) {
      showToaster({
        type: "success",
        description: "Proyecto creado exitosamente",
      });
      setRequired(false);
      setType("PROJECT");
      form.reset();
      setOpen(false);
    } else {
      showToaster({
        type: "error",
        description: response.message || "Error al crear el proyecto",
        duration: 6000,
      });
    }
    setIsSubmitting(false);
  };

  const showToaster = ({ type, description, duration = 3000 }: any) => {
    toaster.create({
      description,
      type,
      closable: true,
      duration,
    });
  };

  return (
    <>
      <Dialog.Root
        size={{ md: "lg" }}
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <Dialog.Trigger asChild>
          <Button colorScheme="blue">
            <FiPlus />
            Nuevo Proyecto
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Toaster />
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Crea tu proyecto o subproyecto</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap="4">
                  <Form
                    form={form}
                    onSubmit={handleSubmit}
                    width="600px"
                    maxWidth="100%"
                    mx="auto"
                    display="flex"
                    flexDirection="column"
                    gap={4}
                  >
                    <Grid
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                      gap={4}
                    >
                      {/* Tipo de usuario - Ocupa toda la fila */}
                      <SelectField
                        name="type"
                        control={form.control}
                        label="Tipo"
                        placeholder="Selecciona el tipo"
                        isRequired
                        disabled={isSubmitting}
                        onChange={onChangeType}
                        options={[
                          { value: "PROJECT", label: "PROJECT" },
                          { value: "SUBPROJECT", label: "SUBPROJECT" },
                        ]}
                      />
                      {type === "SUBPROJECT" && (
                        <SelectField
                          name="parentId"
                          control={form.control}
                          label="Proyecto"
                          placeholder="Selecciona el proyecto padre"
                          isRequired={required}
                          disabled={isSubmitting}
                          options={projects}
                        />
                      )}
                      <GridItem>
                        <InputField
                          name="name"
                          control={form.control}
                          label="Nombre del proyecto"
                          placeholder="Nombre del proyecto"
                          isRequired
                          disabled={isSubmitting}
                        />
                      </GridItem>

                      <GridItem>
                        <SelectField
                          name="status"
                          control={form.control}
                          label="Estado"
                          placeholder="Selecciona el estado"
                          isRequired
                          disabled={isSubmitting}
                          options={[
                            { value: "ACTIVE", label: "ACTIVE" },
                            { value: "RUNNING", label: "RUNNING" },
                            { value: "SUSPENDED", label: "SUSPENDED" },
                            { value: "CANCELED", label: "CANCELED" },
                            { value: "COMPLETED", label: "COMPLETED" },
                          ]}
                        />
                      </GridItem>
                      <GridItem>
                        <InputField
                          name="startDate"
                          type="date"
                          control={form.control}
                          label="Fecha de inicio"
                          placeholder="Fecha de inicio"
                          isRequired
                          disabled={isSubmitting}
                        />
                      </GridItem>
                      <GridItem>
                        <InputField
                          name="endDate"
                          type="date"
                          control={form.control}
                          label="Fecha de finalización"
                          placeholder="Fecha de finalización"
                          isRequired={false}
                          disabled={isSubmitting}
                        />
                      </GridItem>
                      <GridItem>
                        <TextAreaField
                          name="description"
                          control={form.control}
                          label="Descripción"
                          placeholder="Descripción del proyecto"
                          isRequired
                          disabled={isSubmitting}
                        />
                      </GridItem>
                    </Grid>
                    <Grid
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                      gap={8}
                      paddingTop={8}
                    >
                      <Dialog.ActionTrigger asChild>
                        <Button size="lg" variant="outline">
                          Cancelar
                        </Button>
                      </Dialog.ActionTrigger>
                      <Button
                        type="submit"
                        colorScheme="blue"
                        size="md"
                        loading={isSubmitting}
                        loadingText={
                          mode === "edit" ? "Actualizando..." : "Guardando..."
                        }
                        disabled={isSubmitting}
                        //   w="full"
                        //   mt={2}
                      >
                        Guardar
                      </Button>
                    </Grid>
                  </Form>
                </VStack>
              </Dialog.Body>
              {/* <Dialog.Footer></Dialog.Footer> */}
              <Dialog.CloseTrigger asChild>
                <CloseButton size="md" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default FormProjects;
