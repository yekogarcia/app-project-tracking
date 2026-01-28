import { Input, Field, type InputProps } from "@chakra-ui/react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface InputFieldProps<T extends FieldValues = FieldValues> extends Omit<
  InputProps,
  "name"
> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  helperText?: string;
  isRequired?: boolean;
}

export function InputField<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  helperText,
  isRequired,
  ...inputProps
}: InputFieldProps<T>) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
  });

  // console.log("control", control);
  // console.log("inputProps", inputProps);
  // field.onChange(event);

  return (
    <Field.Root invalid={invalid} required={isRequired}>
      {label && <Field.Label>{label}</Field.Label>}
      <Input
        {...field}
        {...inputProps}
        onChange={(e) => {
          if (inputProps.type === "number") {
            field.onChange(
              e.target.value === "" ? undefined : parseInt(e.target.value),
            );
          } else {
            field.onChange(e.target.value);
          }
        }}
        outline="none"
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
      />
      {error && <Field.ErrorText>{error.message}</Field.ErrorText>}
      {helperText && !error && (
        <Field.HelperText>{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
}
