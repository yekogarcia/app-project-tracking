import { z } from 'zod';

// Schemas básicos para auth
export const emailSchema = z
  .string()
  .min(1, 'El email es requerido')
  .email('El email no es válido');

export const passwordSchema = z
  .string()
  .min(1, 'La contraseña es requerida')
  .min(6, 'La contraseña debe tener al menos 6 caracteres');

export const nameSchema = z
  .string()
  .min(1, 'El nombre es requerido')
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(100, 'El nombre no puede exceder 100 caracteres');

export const phoneSchema = z
  .string()
  .min(1, 'El teléfono es requerido')
  .regex(/^[+]?[\d\s\-()]+$/, 'Formato de teléfono inválido')
  .min(8, 'El teléfono debe tener al menos 8 dígitos')
  .max(20, 'El teléfono no puede exceder 20 caracteres');

export const addressSchema = z
  .string()
  .min(1, 'La dirección es requerida')
  .min(10, 'La dirección debe tener al menos 10 caracteres')
  .max(200, 'La dirección no puede exceder 200 caracteres');

export const userTypeSchema = z
  .enum(['PERSONA', 'EMPRESA'], {
    message: 'El tipo debe ser PERSONA o EMPRESA',
  });

// Schemas de formularios de auth
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const registerSchema = z
  .object({
    type: userTypeSchema,
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    address: addressSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// Tipos inferidos de los schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Esquemas individuales para validación
export const authFieldSchemas = {
  type: userTypeSchema,
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  phone: phoneSchema,
  address: addressSchema,
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
} as const;