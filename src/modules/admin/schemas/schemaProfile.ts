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
  .number({ message: 'El teléfono debe ser un número válido' })
  .int('El teléfono debe ser un número entero')
  .min(1000000000, 'El teléfono debe tener al menos 10 dígitos')
  .max(9999999999, 'El teléfono debe tener máximo 10 dígitos');

export const addressSchema = z
  .string()
  .min(1, 'La dirección es requerida')
  .min(10, 'La dirección debe tener al menos 10 caracteres')
  .max(200, 'La dirección no puede exceder 200 caracteres');

// export const userTypeSchema = z
//   .enum(['PERSONAL', 'COMPANY'], {
//     message: 'El tipo debe ser PERSONA o EMPRESA',
//   });

export const profileSchema = z
  .object({
    // type: userTypeSchema,
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    address: addressSchema,
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    oldPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Si se proporciona password, debe tener al menos 6 caracteres
      if (data.password && data.password.length > 0) {
        return data.password.length >= 6;
      }
      return true;
    },
    {
      message: 'La contraseña debe tener al menos 6 caracteres',
      path: ['password'],
    }
  )
  .refine(
    (data) => {
      // Si se proporciona oldPassword, password también debe proporcionarse
      if (data.oldPassword && data.oldPassword.length > 0) {
        return data.password && data.password.length > 0;
      }
      return true;
    },
    {
      message: 'Debes ingresar una nueva contraseña',
      path: ['password'],
    }
  )
  .refine(
    (data) => {
      // Si se proporciona password, confirmPassword debe coincidir
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => {
      // Si se proporciona oldPassword, debe tener al menos 6 caracteres
      if (data.oldPassword && data.oldPassword.length > 0) {
        return data.oldPassword.length >= 6;
      }
      return true;
    },
    {
      message: 'La contraseña debe tener al menos 6 caracteres',
      path: ['oldPassword'],
    }
  );

// Tipos inferidos de los schemas
export type ProfileFormData = z.infer<typeof profileSchema>;