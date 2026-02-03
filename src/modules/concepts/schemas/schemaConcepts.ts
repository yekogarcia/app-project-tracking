import { z } from "zod";

export const descriptionSchema = z.string()
    .min(1, 'La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres');

export const conceptSchema = z
    .object({
        id: z.number().optional(),
        status: z.enum(['ACTIVO', 'INACTIVO'], {
            message: 'El tipo debe ser ACTIVO o INACTIVO',
        }),
        concept: z.string().min(1, 'El nombre del concepto es requerido'),
        view: z.enum(['COMPANY', 'PROJECT'], {
            message: 'El tipo debe ser COMPANY o PROJECT',
        }).optional(),
        projectId: z.number().min(1, 'El proyecto es requerido'),
        description: descriptionSchema,
    })

export type ConceptFormData = z.infer<typeof conceptSchema>;