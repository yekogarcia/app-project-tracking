import { nameSchema } from "@/modules/auth/schemas";
import { z } from "zod";

export const projectTypeSchema = z.enum(['PROJECT', 'SUBPROJECT'], {
    message: 'El tipo debe ser PROJECT o SUBPROJECT',
});

export const statusSchema = z.enum(['ACTIVE', 'SUSPENDED', 'RUNNING', 'CANCELED', 'COMPLETED'], {
    message: 'El estado debe ser ACTIVE, SUSPENDED, RUNNING, CANCELED o COMPLETED',
});

export const descriptionSchema = z.string()
    .min(1, 'La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres');

export const projectsSchema = z
    .object({
        id: z.number().optional(),
        type: projectTypeSchema,
        parentId: z.number().optional(),
        name: nameSchema,
        status: statusSchema,
        startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: 'La fecha de inicio no es válida',
        }),
        endDate: z.string().optional(),
        description: descriptionSchema
    })
    .refine(
        (data) =>
            data.type !== 'SUBPROJECT' || Boolean(data.parentId),
        {
            message: 'Debe seleccionar un proyecto padre',
            path: ['parentId'],
        });

export type ProjectsFormData = z.infer<typeof projectsSchema>;