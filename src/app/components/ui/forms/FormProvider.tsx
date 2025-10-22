import { type ReactNode } from "react"
import {
  FormProvider as RHFFormProvider,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";
import { Box, type BoxProps } from "@chakra-ui/react";

interface FormProviderProps<T extends FieldValues = FieldValues>
  extends Omit<BoxProps, "onSubmit"> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
  /** Ancho del formulario. Acepta valores responsive */
  width?: BoxProps["width"];
  /** Ancho máximo del formulario. Acepta valores responsive */
  maxWidth?: BoxProps["maxWidth"];
}

export function FormProvider<T extends FieldValues = FieldValues>({
  form,
  onSubmit,
  children,
  width = "100%",
  maxWidth,
  ...boxProps
}: FormProviderProps<T>) {
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <RHFFormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <Box width={width} maxWidth={maxWidth} {...boxProps}>
          {children}
        </Box>
      </form>
    </RHFFormProvider>
  );
}
