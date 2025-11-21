import {
  Field,
  NativeSelectRoot,
  NativeSelectField,
  NativeSelectIndicator,
  type NativeSelectRootProps,
} from '@chakra-ui/react';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps<T extends FieldValues = FieldValues> extends Omit<NativeSelectRootProps, 'name'> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  helperText?: string;
  isRequired?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export function SelectField<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  helperText,
  isRequired,
  options,
  placeholder = "Selecciona una opción",
  ...selectProps
}: SelectFieldProps<T>) {
  const {
    field: { value, onChange, onBlur },
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
  });

  return (
    <Field.Root invalid={invalid} required={isRequired}>
      {label && <Field.Label>{label}</Field.Label>}
      <NativeSelectRoot
        {...selectProps}
        size={{ base: 'md', md: 'lg' }}
      >
        <NativeSelectField
          value={value || ''}
          onChange={(e: any) => onChange(e.target.value)}
          onBlur={onBlur}
          borderColor={{ base: "gray.300", _dark: "gray.600" }}
          _hover={{
            borderColor: { base: "gray.400", _dark: "gray.500" }
          }}
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px #3182ce"
          }}
          bg={{ base: "white", _dark: "gray.700" }}
          color={{ base: "gray.900", _dark: "white" }}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelectField>
        <NativeSelectIndicator />
      </NativeSelectRoot>
      {error && <Field.ErrorText>{error.message}</Field.ErrorText>}
      {helperText && !error && (
        <Field.HelperText>{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
}