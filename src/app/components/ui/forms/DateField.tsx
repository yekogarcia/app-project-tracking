import { Input, Field, type InputProps } from "@chakra-ui/react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface DateFieldProps<T extends FieldValues = FieldValues>
  extends Omit<InputProps, "name"> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  helperText?: string;
  isRequired?: boolean;
  /** min and max accept date strings in YYYY-MM-DD format */
  min?: string;
  max?: string;
}

export function DateField<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  helperText,
  isRequired,
  min,
  max,
  ...inputProps
}: DateFieldProps<T>) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
  });

  // Ensure value is a string (HTML date input expects YYYY-MM-DD or empty string)
  const value = field.value ?? "";

  return (
    <Field.Root invalid={invalid} required={isRequired}>
      {label && <Field.Label>{label}</Field.Label>}
      <Input
        {...field}
        {...inputProps}
        type="date"
        value={value}
        min={min}
        max={max}
        outline="none"
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

export default DateField;
