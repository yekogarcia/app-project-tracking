import { z } from "zod";

export const descriptionSchema = z.string()
    .min(1, 'La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres');

export const incomeSchema = z
    .object({
        id: z.number().optional(),
        type: z.enum(['OPERACIONALES', 'NO OPERACIONALES'], {
            message: 'El tipo debe ser OPERACIONALES o NO OPERACIONALES',
        }),
        incomeName: z.string().min(1, 'El nombre del ingreso es requerido'),
        incomeValue: z.number().min(0, 'El valor del ingreso debe ser mayor o igual a 0'),
        incomeDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: 'La fecha del ingreso no es válida',
        }),
        paymentMethod: z.enum(['EFECTIVO', 'TRANFERENCIA'], {
            message: 'El tipo debe ser EFECTIVO o NO EFECTIVO',
        }),
        referenceNumber: z.string().min(0, 'El precio total debe ser mayor o igual a 0'),
        projectId: z.number().min(1, 'El proyecto es requerido'),
        description: descriptionSchema,
    })

export type IncomeFormData = z.infer<typeof incomeSchema>;