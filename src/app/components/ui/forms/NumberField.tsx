import { Input, Field, type InputProps } from "@chakra-ui/react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface NumberFieldProps<T extends FieldValues = FieldValues>
  extends Omit<InputProps, "name" | "onChange" | "value" | "type"> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  helperText?: string;
  isRequired?: boolean;
  /** Permitir números decimales (default: true) */
  allowDecimals?: boolean;
  /** Valor mínimo permitido */
  min?: number;
  /** Valor máximo permitido */
  max?: number;
  /** Número de decimales permitidos (default: 2) */
  decimalPlaces?: number;
  /** Prefijo para mostrar (ej: "$", "€") */
  prefix?: string;
  /** Sufijo para mostrar (ej: "%", "kg") */
  suffix?: string;
}

export function NumberField<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  helperText,
  isRequired,
  allowDecimals = true,
  min,
  max,
  decimalPlaces = 2,
  prefix,
  suffix,
  placeholder,
  ...inputProps
}: NumberFieldProps<T>) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
  });

  // Formatear valor para mostrar
  const formatDisplayValue = (value: number | string | undefined): string => {
    if (value === undefined || value === null || value === '') return '';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';
    
    // Formatear con decimales si está permitido
    const formattedNumber = allowDecimals 
      ? numValue.toFixed(decimalPlaces).replace(/\.?0+$/, '') 
      : Math.floor(numValue).toString();
    
    // Agregar prefijo y sufijo
    let displayValue = formattedNumber;
    if (prefix) displayValue = prefix + displayValue;
    if (suffix) displayValue = displayValue + suffix;
    
    return displayValue;
  };

  // Parsear valor de entrada
  const parseInputValue = (inputValue: string): number | undefined => {
    if (!inputValue || inputValue.trim() === '') return undefined;
    
    // Remover prefijo y sufijo
    let cleanValue = inputValue;
    if (prefix) cleanValue = cleanValue.replace(prefix, '');
    if (suffix) cleanValue = cleanValue.replace(suffix, '');
    
    // Limpiar caracteres no numéricos (excepto punto decimal y signo negativo)
    cleanValue = cleanValue.replace(/[^\d.-]/g, '');
    
    const numValue = allowDecimals ? parseFloat(cleanValue) : parseInt(cleanValue, 10);
    
    if (isNaN(numValue)) return undefined;
    
    // Aplicar límites
    let finalValue = numValue;
    if (min !== undefined && finalValue < min) finalValue = min;
    if (max !== undefined && finalValue > max) finalValue = max;
    
    return finalValue;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseInputValue(inputValue);
    
    // Actualizar el campo con el valor numérico
    field.onChange(numericValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur();
    
    // Formatear el valor al perder el foco
    const currentValue = field.value;
    if (currentValue !== undefined && currentValue !== null) {
      // Forzar re-render con valor formateado
      const formattedValue = formatDisplayValue(currentValue);
      e.target.value = formattedValue;
    }
  };

  // Calcular step para el input
  const stepValue = allowDecimals ? Math.pow(10, -decimalPlaces) : 1;

  return (
    <Field.Root invalid={invalid} required={isRequired}>
      {label && <Field.Label>{label}</Field.Label>}
      <Input
        {...inputProps}
        type="number"
        step={stepValue}
        min={min}
        max={max}
        name={field.name}
        value={formatDisplayValue(field.value)}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        size={{ base: "md", md: "lg" }}
        borderColor={{ base: "gray.300", _dark: "gray.600" }}
        _hover={{
          borderColor: { base: "gray.400", _dark: "gray.500" },
        }}
        _focus={{
          borderColor: "blue.500",
          boxShadow: "0 0 0 1px #3182ce",
        }}
        bg={{ base: "white", _dark: "gray.700" }}
      />
      {error && <Field.ErrorText>{error.message}</Field.ErrorText>}
      {helperText && !error && (
        <Field.HelperText>{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
}

// Variantes específicas del NumberField
export function CurrencyField<T extends FieldValues = FieldValues>(
  props: Omit<NumberFieldProps<T>, 'prefix' | 'allowDecimals' | 'decimalPlaces'>
) {
  return (
    <NumberField
      {...props}
      prefix="$"
      allowDecimals={true}
      decimalPlaces={2}
      placeholder="0.00"
    />
  );
}

export function PercentageField<T extends FieldValues = FieldValues>(
  props: Omit<NumberFieldProps<T>, 'suffix' | 'min' | 'max'>
) {
  return (
    <NumberField
      {...props}
      suffix="%"
      min={0}
      max={100}
      placeholder="0"
    />
  );
}

export function IntegerField<T extends FieldValues = FieldValues>(
  props: Omit<NumberFieldProps<T>, 'allowDecimals' | 'decimalPlaces'>
) {
  return (
    <NumberField
      {...props}
      allowDecimals={false}
      decimalPlaces={0}
      placeholder="0"
    />
  );
}