import { Field, type InputProps, NumberInput } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
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
  /** Código ISO de moneda para formateo (ej: 'USD', 'EUR'). Si se proporciona, se usará Intl.NumberFormat style:'currency' */
  currency?: string;
}

export function NumberField<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  helperText,
  isRequired,
  ...inputProps
}: NumberFieldProps<T>) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
  });

  const { value, ref, onBlur, onChange } = field;

  return (
    <Field.Root invalid={invalid} required={isRequired}>
      {label && <Field.Label>{label}</Field.Label>}
      <NumberInput.Root
        // onChange={onChange}
        ref={ref}
        onBlur={onBlur}
        disabled={inputProps.disabled}
        value={value?.toString() ?? ""}
        onValueChange={(details) => {
          onChange(details.valueAsNumber);
        }}
        name={name}
        // {...field}
        // {...inputProps}
        outline="none"
        width="100%"
        borderRadius="0.3rem"
        size={{ base: "md", md: "md" }}
        borderColor={{ base: "gray.300", _dark: "gray.600" }}
        _hover={{
          borderColor: { base: "gray.400", _dark: "gray.500" },
        }}
        _focus={{
          borderColor: "blue.500",
          boxShadow: "0 0 0 1px #3182ce",
        }}
        bg={{ base: "white", _dark: "gray.700" }}
        formatOptions={{
          style: "currency",
          currency: "COP",
          currencyDisplay: "code",
          currencySign: "accounting",
        }}
      >
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
      {error && <Field.ErrorText>{error.message}</Field.ErrorText>}
      {helperText && !error && (
        <Field.HelperText>{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
}
