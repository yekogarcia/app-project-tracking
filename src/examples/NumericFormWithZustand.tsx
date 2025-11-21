import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Card,
  Grid,
  GridItem,
  Alert,
} from '@chakra-ui/react';
import {
  NumberField,
  CurrencyField,
  PercentageField,
  IntegerField,
  InputField,
} from '../app/components/ui/forms';
import { useNumericFormStore, useNotifications } from '../app/store';

// 📋 Schema de validación con Zod
const numericFormSchema = z.object({
  // Campos de texto
  name: z.string().min(1, 'Nombre es requerido'),
  description: z.string().optional(),
  
  // Campos numéricos - todos se convertirán automáticamente a number
  age: z.number().min(18, 'Debe ser mayor de edad').max(120, 'Edad máxima 120'),
  salary: z.number().min(0, 'Salario debe ser positivo'),
  price: z.number().min(0, 'Precio debe ser positivo'),
  quantity: z.number().int().min(1, 'Cantidad mínima 1'),
  percentage: z.number().min(0).max(100, 'Porcentaje entre 0-100'),
});

type NumericFormData = z.infer<typeof numericFormSchema>;

export function NumericFormExample() {
  // 🎯 Hook del store de Zustand
  const {
    formData,
    setField,
    setMultipleFields,
    resetForm,
    isLoading,
    setLoading,
    error,
    setError,
    clearError,
    getFormattedValue,
    isValid,
  } = useNumericFormStore();
  
  const { addNotification } = useNotifications();

  // 🎪 React Hook Form setup
  const form = useForm<NumericFormData>({
    resolver: zodResolver(numericFormSchema),
    defaultValues: {
      name: '',
      description: '',
      age: undefined,
      salary: undefined,
      price: undefined,
      quantity: undefined,
      percentage: undefined,
    },
  });

  // 📡 Sync entre React Hook Form y Zustand store
  React.useEffect(() => {
    const subscription = form.watch((data) => {
      // Solo sincronizar campos que han cambiado
      if (data) {
        setMultipleFields(data as any);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setMultipleFields]);

  // 🚀 Submit handler
  const onSubmit = async (data: NumericFormData) => {
    console.log('🎯 Datos del formulario (todos los números son tipo number):');
    console.log('name:', typeof data.name, '=', data.name);
    console.log('age:', typeof data.age, '=', data.age);
    console.log('salary:', typeof data.salary, '=', data.salary);
    console.log('price:', typeof data.price, '=', data.price);
    console.log('quantity:', typeof data.quantity, '=', data.quantity);
    console.log('percentage:', typeof data.percentage, '=', data.percentage);

    try {
      setLoading(true);
      clearError();

      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar que todos los campos numéricos son realmente números
      const numericFields = ['age', 'salary', 'price', 'quantity', 'percentage'];
      const allNumbers = numericFields.every(field => 
        data[field as keyof NumericFormData] === undefined || 
        typeof data[field as keyof NumericFormData] === 'number'
      );

      if (allNumbers) {
        addNotification({
          type: 'success',
          title: '¡Éxito!',
          message: 'Todos los campos numéricos son del tipo correcto (number)',
        });
        
        // Guardar en el store
        setMultipleFields(data);
      } else {
        throw new Error('Algunos campos no son del tipo number');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Reset handler
  const handleReset = () => {
    form.reset();
    resetForm();
    addNotification({
      type: 'info',
      title: 'Formulario reiniciado',
    });
  };

  return (
    <Box maxWidth="800px" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        {/* 📊 Header */}
        <Card.Root p={6}>
          <Card.Header>
            <Text fontSize="2xl" fontWeight="bold">
              📊 Ejemplo de Formulario con Campos Numéricos + Zustand
            </Text>
            <Text color="gray.600">
              Este formulario garantiza que los campos numéricos devuelvan valores de tipo 'number'
            </Text>
          </Card.Header>
        </Card.Root>

        {/* ❌ Error Display */}
        {error && (
          <Alert.Root status="error">
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}

        {/* 📝 Formulario */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <VStack spacing={6} align="stretch">
            <Card.Root p={6}>
              <Card.Header>
                <Text fontSize="lg" fontWeight="semibold">Información Básica</Text>
              </Card.Header>
              
              <Card.Body>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                  <GridItem>
                    <InputField
                      name="name"
                      control={form.control}
                      label="Nombre completo"
                      placeholder="Tu nombre"
                      isRequired
                    />
                  </GridItem>
                  
                  <GridItem>
                    <IntegerField
                      name="age"
                      control={form.control}
                      label="Edad"
                      placeholder="25"
                      min={18}
                      max={120}
                      helperText="Solo números enteros"
                      isRequired
                    />
                  </GridItem>
                  
                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <InputField
                      name="description"
                      control={form.control}
                      label="Descripción"
                      placeholder="Descripción opcional..."
                    />
                  </GridItem>
                </Grid>
              </Card.Body>
            </Card.Root>

            <Card.Root p={6}>
              <Card.Header>
                <Text fontSize="lg" fontWeight="semibold">Campos Numéricos Especializados</Text>
              </Card.Header>
              
              <Card.Body>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                  <GridItem>
                    <CurrencyField
                      name="salary"
                      control={form.control}
                      label="Salario mensual"
                      placeholder="2500000"
                      min={0}
                      helperText="En pesos colombianos"
                    />
                  </GridItem>
                  
                  <GridItem>
                    <NumberField
                      name="price"
                      control={form.control}
                      label="Precio del producto"
                      placeholder="199.99"
                      min={0}
                      allowDecimals={true}
                      decimalPlaces={2}
                      prefix="$"
                      helperText="Precio con decimales"
                    />
                  </GridItem>
                  
                  <GridItem>
                    <IntegerField
                      name="quantity"
                      control={form.control}
                      label="Cantidad"
                      placeholder="10"
                      min={1}
                      suffix=" unidades"
                      helperText="Solo números enteros"
                    />
                  </GridItem>
                  
                  <GridItem>
                    <PercentageField
                      name="percentage"
                      control={form.control}
                      label="Porcentaje de descuento"
                      placeholder="15"
                      helperText="Entre 0 y 100"
                    />
                  </GridItem>
                </Grid>
              </Card.Body>
            </Card.Root>

            {/* 🔘 Botones de acción */}
            <HStack spacing={4}>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                flex={1}
                loading={isLoading}
                loadingText="Guardando..."
                disabled={!form.formState.isValid}
              >
                💾 Guardar Datos
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleReset}
                disabled={isLoading}
              >
                🔄 Limpiar
              </Button>
            </HStack>
          </VStack>
        </form>

        {/* 📊 Vista del estado actual */}
        <Card.Root p={6}>
          <Card.Header>
            <Text fontSize="lg" fontWeight="semibold">
              📊 Estado Actual del Store (Zustand)
            </Text>
          </Card.Header>
          
          <Card.Body>
            <Box bg="gray.50" p={4} borderRadius="md" fontSize="sm">
              <Text fontWeight="semibold" mb={2}>Datos guardados:</Text>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
              
              <Text fontWeight="semibold" mt={4} mb={2}>Valores formateados:</Text>
              <VStack align="start" spacing={1}>
                <Text>💰 Salario: {getFormattedValue('salary', 'currency')}</Text>
                <Text>📈 Porcentaje: {getFormattedValue('percentage', 'percentage')}</Text>
                <Text>💵 Precio: {getFormattedValue('price', 'currency')}</Text>
              </VStack>
              
              <Text mt={4}>
                <Text as="span" fontWeight="semibold">Estado:</Text>{' '}
                {isValid() ? '✅ Válido' : '❌ Inválido'}
              </Text>
            </Box>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
}