import { z } from "zod";

export const expenseTypeSchema = z.enum(['COSTO', 'GASTO', 'ACTIVO'], {
    message: 'El tipo debe ser COSTO, GASTO o ACTIVO',
});

export const descriptionSchema = z.string()
    .min(1, 'La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres');

export const expenseSchema = z
    .object({
        id: z.number().optional(),
        projectId: z.number().min(1, 'El proyecto es requerido'),
        typeExpense: expenseTypeSchema,
        type: z.string().min(1, 'El tipo es requerido'),
        concept: z.number().min(1, 'El concepto es requerido'),
        expense: z.string().min(1, 'El egreso es requerido'),
        price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
        quantity: z.number().min(1, 'La cantidad debe ser mayor  a 0'),
        totalPrice: z.number().min(0, 'El precio total debe ser mayor o igual a 0'),
        expenseDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: 'La fecha de egreso no es válida',
        }),
        description: descriptionSchema
    })

export type ExpenseFormData = z.infer<typeof expenseSchema>;