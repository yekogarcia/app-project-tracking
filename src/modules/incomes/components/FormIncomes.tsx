import {
  Form,
  InputField,
  NumberField,
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

import { incomeSchema, type IncomeFormData } from "../schemas/schemaIncomes";

import type { ISelect } from "@/app";
import { incomesService } from "@/services/incomes/IncomesServices";

interface IFormProps {
  defaultValues?: Partial<IncomeFormData>;
  /** 📝 Modo del formulario: 'create' | 'edit' */
  mode?: "create" | "edit";
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  refreshDashboard: () => void;
  projects: ISelect[];
  /** Mostrar el botón trigger interno (por defecto true). Si el trigger se coloca en el padre, pasar false */
}

export const FormIncomes = ({
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

  const form = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
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
    console.log("defaultValues", defaultValues);
  }, [open, mode]);

  const handleSubmit = async (data: any) => {
    delete data.id;
    setIsSubmitting(true);
    const response = await incomesService.saveIncome(data, defaultValues?.id);

    if (response.statusCode === 200) {
      showToaster({
        type: "success",
        description: "Ingreso guardado exitosamente",
      });
      form.reset();
      setOpen(false);
      refreshDashboard();
    } else {
      showToaster({
        type: "error",
        description: response.message || "Error al crear el ingreso",
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
                      <SelectField
                        name="projectId"
                        control={form.control}
                        label="Proyecto"
                        placeholder="Selecciona el proyecto"
                        isRequired
                        disabled={isSubmitting}
                        options={projects}
                      />
                      <SelectField
                        name="type"
                        control={form.control}
                        label="Tipo de egreso"
                        placeholder="Selecciona el tipo"
                        isRequired
                        disabled={isSubmitting}
                        options={[
                          { value: "OPERACIONALES", label: "OPERACIONALES" },
                          {
                            value: "NO OPERACIONALES",
                            label: "NO OPERACIONALES",
                          },
                        ]}
                      />
                      <GridItem>
                        <InputField
                          name="incomeName"
                          control={form.control}
                          label="Ingreso"
                          placeholder="Ingreso"
                          isRequired
                          disabled={isSubmitting}
                        />
                      </GridItem>
                      <GridItem>
                        <NumberField
                          name="incomeValue"
                          control={form.control}
                          label="Valor ingreso"
                          placeholder="Valor ingreso"
                          isRequired
                          disabled={isSubmitting}
                        />
                      </GridItem>
                      <SelectField
                        name="paymentMethod"
                        control={form.control}
                        label="Metodo de pago"
                        placeholder="Selecciona el metodo de pago"
                        isRequired
                        disabled={isSubmitting}
                        options={[
                          { value: "EFECTIVO", label: "EFECTIVO" },
                          { value: "TRANFERENCIA", label: "TRANFERENCIA" },
                        ]}
                      />
                      <GridItem>
                        <InputField
                          name="referenceNumber"
                          control={form.control}
                          label="Número de referencia"
                          placeholder="Número de referencia"
                          isRequired={false}
                          disabled={isSubmitting}
                        />
                      </GridItem>
                      <GridItem>
                        <InputField
                          name="incomeDate"
                          type="date"
                          control={form.control}
                          label="Fecha de ingreso"
                          placeholder="Fecha de ingreso"
                          isRequired
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
