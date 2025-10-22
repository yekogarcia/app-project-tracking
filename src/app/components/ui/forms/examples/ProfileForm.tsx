import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@chakra-ui/react';
import { FormProvider, FormField, nameSchema, emailSchema } from '../index';

// Example: Profile form schema
const profileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^[+]?[\d\s-()]+$/, 'Formato de teléfono inválido'),
  bio: z
    .string()
    .max(500, 'La biografía no puede exceder 500 caracteres')
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => void | Promise<void>;
  isLoading?: boolean;
}

export function ProfileForm({ initialData, onSubmit, isLoading = false }: ProfileFormProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      bio: initialData?.bio || '',
    },
  });

  return (
    <FormProvider form={form} onSubmit={onSubmit}>
      <FormField
        name="name"
        control={form.control}
        label="Nombre completo"
        placeholder="Tu nombre completo"
        isRequired
      />

      <FormField
        name="email"
        control={form.control}
        label="Email"
        type="email"
        placeholder="tu@email.com"
        isRequired
      />

      <FormField
        name="phone"
        control={form.control}
        label="Teléfono"
        type="tel"
        placeholder="+1 (555) 123-4567"
        isRequired
      />

      <FormField
        name="bio"
        control={form.control}
        label="Biografía"
        placeholder="Cuéntanos sobre ti..."
        helperText="Máximo 500 caracteres"
        as="textarea"
        resize="vertical"
        minH="100px"
      />

      <Button
        type="submit"
        colorScheme="blue"
        size={{ base: 'md', md: 'lg' }}
        loading={isLoading}
        loadingText="Guardando..."
        w="full"
      >
        Guardar Perfil
      </Button>
    </FormProvider>
  );
}