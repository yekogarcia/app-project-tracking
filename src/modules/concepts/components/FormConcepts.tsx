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
import { useState, type Dispatch, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toaster } from "@/app/components/ux/toaster";

import type { ISelect } from "@/app";
import { conceptSchema, type ConceptFormData } from "../schemas/schemaConcepts";
import { conceptsService } from "@/services/concepts/conceptsService";

interface IFormProps {
  defaultValues?: Partial<ConceptFormData>;
  /** 📝 Modo del formulario: 'create' | 'edit' */
  mode?: "create" | "edit";
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  refreshDashboard: () => void;
  projects: ISelect[];
  /** Mostrar el botón trigger interno (por defecto true). Si el trigger se coloca en el padre, pasar false */
}

export const FormConcepts = ({
  defaultValues,
  mode = "create",
  open,
  setOpen,
  refreshDashboard,
  projects,
}: IFormProps) => {
  //   const { onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const { account } = useAuthStore();

  const form = useForm<ConceptFormData>({
    resolver: zodResolver(conceptSchema),
    defaultValues: defaultValues,
  });

  // When defaultValues change (e.g. edit action), reset the form to load values
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues as any);
    }
  }, [defaultValues]);

  // const onChangeType = async () => {
  //   const values = form.getValues();
  //   if (values.projectId) {
  //     getConcepts(values.projectId);
  //   } else {
  //     showToaster({
  //       type: "warn",
  //       description: "Selecciona un proyecto",
  //       duration: 3000,
  //     });
  //   }
  // };

  // If dialog opens in create mode, ensure form is reset to the create defaults
  useEffect(() => {
    if (open && mode === "create") {
      form.reset(defaultValues as any);
    }
  }, [open, mode]);

  const handleSubmit = async (data: any) => {
    delete data.id;
    setIsSubmitting(true);
    const response = await conceptsService.saveConcept(data, defaultValues?.id);

    if (response.statusCode === 200) {
      showToaster({
        type: "success",
        description: "Concepto guardado exitosamente",
      });
      form.reset();
      setOpen(false);
      refreshDashboard();
    } else {
      showToaster({
        type: "error",
        description: response.message || "Error al crear el concepto",
        duration: 6000,
      });
    }
    refreshDashboard();
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
        // onOpenChange may provide an object or boolean depending on the dialog implementation
        onOpenChange={(details: any) => {
          const next = typeof details === "boolean" ? details : details?.open;
          setOpen(Boolean(next));
        }}
      >
        <Portal>
          <Toaster />
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Registra un nuevo ingreso</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap="4">
                  <Form
                    form={form}
                    onSubmit={handleSubmit}
                    size="container"
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
                      <GridItem>
                        <InputField
                          name="concept"
                          control={form.control}
                          label="Concepto"
                          placeholder="Concepto"
                          isRequired
                          disabled={isSubmitting}
                        />
                      </GridItem>
                      <SelectField
                        name="status"
                        control={form.control}
                        label="Estado"
                        placeholder="Selecciona el estado"
                        isRequired
                        disabled={isSubmitting}
                        options={[
                          { value: "ACTIVO", label: "ACTIVO" },
                          { value: "INACTIVO", label: "INACTIVO" },
                        ]}
                      />

                      <SelectField
                        name="view"
                        control={form.control}
                        label="Tipo de vista"
                        placeholder="Selecciona el tipo"
                        isRequired
                        disabled={isSubmitting}
                        options={[
                          { value: "PROJECT", label: "PROJECT" },
                          { value: "COMPANY", label: "COMPANY" },
                        ]}
                      />
                      <SelectField
                        name="projectId"
                        control={form.control}
                        label="Proyecto"
                        placeholder="Selecciona el proyecto"
                        isRequired
                        disabled={isSubmitting}
                        options={projects}
                      />
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
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setOpen(false)}
                      >
                        Cancelar
                      </Button>
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
