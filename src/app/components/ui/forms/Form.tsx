import { type ReactNode } from "react";
import {
  FormProvider,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";
import { Box, type BoxProps } from "@chakra-ui/react";

// Configuraciones predefinidas para diferentes casos de uso
export const FORM_SIZES = {
  // Anchos fijos - ideales para modales y componentes específicos
  xs: { width: "200px" },           // Extra pequeño
  sm: { width: "300px" },           // Pequeño  
  md: { width: "400px" },           // Mediano
  lg: { width: "600px" },           // Grande
  xl: { width: "800px" },           // Extra grande
  
  // Anchos adaptativos - se ajustan al contexto
  auto: {},                         // Sin restricciones (se adapta al contenido)
  container: { width: "100%" },     // 100% del contenedor padre
  
  // Anchos de viewport - para formularios que necesitan espacio específico  
  quarter: { width: "25vw" },       // 25% de la pantalla
  third: { width: "33vw" },         // 33% de la pantalla  
  half: { width: "50vw" },          // 50% de la pantalla
  twoThirds: { width: "67vw" },     // 67% de la pantalla
  threeQuarters: { width: "75vw" }, // 75% de la pantalla
  full: { width: "100vw" },         // Pantalla completa
} as const;

export type FormSize = keyof typeof FORM_SIZES;

interface FormProviderProps<T extends FieldValues = FieldValues>
  extends Omit<BoxProps, "onSubmit"> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
  /** Tamaño predefinido del formulario */
  size?: FormSize;
  /** Ancho del formulario. Acepta valores responsive. Sobrescribe la opción 'size' */
  width?: BoxProps["width"];
  /** Ancho máximo del formulario. Acepta valores responsive. Sobrescribe la opción 'size' */
  maxWidth?: BoxProps["maxWidth"];
  /** Centrar el formulario horizontalmente */
  centered?: boolean;
}

export function Form<T extends FieldValues = FieldValues>({
  form,
  onSubmit,
  children,
  size = "auto",
  width,
  maxWidth,
  centered = false,
  ...boxProps
}: FormProviderProps<T>) {
  const handleSubmit = form.handleSubmit(onSubmit);

  // Determinar las dimensiones finales
  const sizeConfig = FORM_SIZES[size];
  const finalWidth = width ?? (sizeConfig as any).width;

  // Solo aplicar maxWidth si se especifica explícitamente
  const maxWidthProps = maxWidth ? { maxWidth } : {};

  // Aplicar centrado si está habilitado
  const centeringProps = centered ? { mx: "auto" } : {};

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <Box
          width={finalWidth}
          {...maxWidthProps}
          {...centeringProps}
          {...boxProps}
        >
          {children}
        </Box>
      </form>
    </FormProvider>
  );
}
