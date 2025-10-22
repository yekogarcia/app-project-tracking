// Ejemplos de uso del FormProvider personalizable con anchos flexibles

import { FormProvider } from "./FormProvider";
import { FormField } from "./FormField";
import { useForm } from "react-hook-form";

// 1. Formulario de 50% de la pantalla
function HalfScreenForm() {
  const form = useForm();
  
  return (
    <FormProvider
      form={form}
      onSubmit={(data: any) => console.log(data)}
      size="half"
      centered
    >
      <FormField name="field1" control={form.control} placeholder="50% de la pantalla" />
    </FormProvider>
  );
}

// 2. Formulario de 25% de la pantalla
function QuarterScreenForm() {
  const form = useForm();
  
  return (
    <FormProvider
      form={form}
      onSubmit={(data: any) => console.log(data)}
      size="quarter"
      centered
    >
      <FormField name="field1" control={form.control} placeholder="25% de la pantalla" />
    </FormProvider>
  );
}

// 3. Formulario personalizado - 80% de la pantalla
function CustomPercentageForm() {
  const form = useForm();
  
  return (
    <FormProvider
      form={form}
      onSubmit={(data: any) => console.log(data)}
      width="80vw"
      centered
    >
      <FormField name="field1" control={form.control} placeholder="80% de la pantalla" />
    </FormProvider>
  );
}

// 4. Formulario adaptable al contenedor
function ContainerAdaptedForm() {
  const form = useForm();
  
  return (
    <FormProvider
      form={form}
      onSubmit={(data: any) => console.log(data)}
      size="container"
    >
      <FormField name="field1" control={form.control} placeholder="100% del contenedor" />
    </FormProvider>
  );
}

// 5. Formulario con ancho responsive
function ResponsiveForm() {
  const form = useForm();
  
  return (
    <FormProvider
      form={form}
      onSubmit={(data: any) => console.log(data)}
      width={{ base: "90vw", md: "60vw", lg: "40vw" }}
      centered
    >
      <FormField name="field1" control={form.control} placeholder="Responsive" />
    </FormProvider>
  );
}