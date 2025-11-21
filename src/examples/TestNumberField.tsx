import { Box, Text, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NumberField, IntegerField, Form } from "../app/components/ui/forms";

// Schema de prueba
const testSchema = z.object({
  phone: z.number()
    .int('Debe ser un número entero')
    .min(1000000000, 'Mínimo 10 dígitos')
    .max(9999999999, 'Máximo 10 dígitos'),
  age: z.number()
    .int('Debe ser un número entero')
    .min(18, 'Mínimo 18 años')
    .max(120, 'Máximo 120 años'),
});

type TestFormData = z.infer<typeof testSchema>;

export function TestNumberField() {
  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      phone: undefined,
      age: undefined,
    },
  });

  const onSubmit = (data: TestFormData) => {
    console.log('🎯 Datos del formulario:');
    console.log('phone:', typeof data.phone, '=', data.phone); // number
    console.log('age:', typeof data.age, '=', data.age); // number
    
    alert(`Teléfono: ${data.phone} (${typeof data.phone})\nEdad: ${data.age} (${typeof data.age})`);
  };

  return (
    <Box maxWidth="500px" mx="auto" p={6}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          🧪 Prueba NumberField Component
        </Text>
        
        <Form form={form} onSubmit={onSubmit}>
          <VStack spacing={4} align="stretch">
            <NumberField
              name="phone"
              control={form.control}
              label="Teléfono"
              placeholder="3001234567"
              allowDecimals={false}
              min={1000000000}
              max={9999999999}
              helperText="Solo números (10 dígitos)"
              isRequired
            />
            
            <IntegerField
              name="age"
              control={form.control}
              label="Edad"
              placeholder="25"
              min={18}
              max={120}
              helperText="Edad en años"
              isRequired
            />
            
            <button 
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: '#3182ce',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Probar Campos Numéricos
            </button>
          </VStack>
        </Form>
        
        <Box bg="gray.50" p={4} borderRadius="md" fontSize="sm">
          <Text fontWeight="bold" mb={2}>📊 Valores actuales:</Text>
          <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
        </Box>
      </VStack>
    </Box>
  );
}