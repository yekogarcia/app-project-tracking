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

import { expenseSchema, type ExpenseFormData } from "../schemas/schemaExpenses";

import { expensesService } from "@/services/expenses/ExpensesService";
import type { ISelect } from "@/app";

interface IFormProps {
  defaultValues?: Partial<ExpenseFormData>;
  /** 📝 Modo del formulario: 'create' | 'edit' */
  mode?: "create" | "edit";
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  refreshDashboard: () => void;
  projects: ISelect[]
  /** Mostrar el botón trigger interno (por defecto true). Si el trigger se coloca en el padre, pasar false */
}

export const FormExpenses = ({
  defaultValues,
  mode = "create",
  open,
  setOpen,
  refreshDashboard,
  projects
}: IFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [concepts, setConcepts] = useState([]);


  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues as any);
    }
  }, [defaultValues]);


  const getConcepts = async (projectId: number) => {
    const response = await expensesService.getConceptsSelect(projectId);

    if (response.statusCode === 200) {
      setConcepts(response.data);
    } else {
      showToaster({
        type: "error",
        description: response.message || "Error al cargar los conceptos",
        duration: 3000,
      });
    }
  };

  const onChangeType = async () => {
    const values = form.getValues();
    if (values.projectId) {
      getConcepts(values.projectId);
    } else {
      showToaster({
        type: "warn",
        description: "Selecciona un proyecto",
        duration: 3000,
      });
    }
  };

  // If dialog opens in create mode, ensure form is reset to the create defaults
  useEffect(() => {
    if (open && mode === "create") {
      form.reset(defaultValues as any);
    } else {
      getConcepts(defaultValues?.projectId || 0);
    }
  }, [open, mode]);

  const handleSubmit = async (data: any) => {
    delete data.id;
    setIsSubmitting(true);
    const response = await expensesService.saveExpense(data, defaultValues?.id);

    if (response.statusCode === 200) {
      showToaster({
        type: "success",
        description: "Egreso creado exitosamente",
      });
      form.reset();
      setOpen(false);
      refreshDashboard()
    } else {
      showToaster({
        type: "error",
        description: response.message || "Error al crear el egreso",
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

  const price = form.watch("price");
  const quantity = form.watch("quantity");

  useEffect(() => {
    form.setValue("totalPrice", quantity * price);
  }, [price, quantity]);

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
                <Dialog.Title>Registra un nuevo egreso</Dialog.Title>
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
                        onChange={onChangeType}
                        disabled={isSubmitting}
                        options={projects}
                      />
                      <SelectField
                        name="typeExpense"
                        control={form.control}
                        label="Tipo de egreso"
                        placeholder="Selecciona el tipo"
                        isRequired
                        disabled={isSubmitting}
                        options={[
                          { value: "COSTO", label: "COSTO" },
                          { value: "GASTO", label: "GASTO" },
                        ]}
                      />
                      <SelectField
                        name="type"
                        control={form.control}
                        label="Tipo"
                        placeholder="Selecciona el tipo"
                        isRequired
                        disabled={isSubmitting}
                        options={[
                          { value: "FIJO", label: "FIJO" },
                          { value: "VARIABLE", label: "VARIABLE" },
                        ]}
                      />
                      <SelectField
                        name="concept"
                        control={form.control}
                        label="Concepto"
                        placeholder="Selecciona el concepto"
                        isRequired
                        disabled={isSubmitting}
                        options={concepts}
                      />
                      <GridItem>
                        <InputField
                          name="expense"
                          control={form.control}
                          label="Egreso"
                          placeholder="Egreso"
                          isRequired
                          disabled={isSubmitting}
                        />
                      </GridItem>
                      <GridItem>
                        <InputField
                          type="number"
                          name="quantity"
                          control={form.control}
                          label="Cantidad"
                          placeholder="Cantidad"
                          isRequired
                          disabled={isSubmitting}
                        />
                      </GridItem>
                      <GridItem>
                        <NumberField
                          name="price"
                          control={form.control}
                          label="Precio"
                          placeholder="Precio unitario"
                          isRequired
                          disabled={isSubmitting}
                        />
                      </GridItem>
                      <GridItem>
                        <NumberField
                          name="totalPrice"
                          control={form.control}
                          label="Precio total"
                          placeholder="Precio total"
                          isRequired
                          disabled={true}
                        />
                      </GridItem>
                      <GridItem>
                        <InputField
                          name="expenseDate"
                          type="date"
                          control={form.control}
                          label="Fecha de egreso"
                          placeholder="Fecha de egreso"
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
