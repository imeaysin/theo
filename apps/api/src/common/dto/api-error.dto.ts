import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ApiErrorSchema = z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.record(z.string(), z.array(z.string()))]),
  error: z.string().optional(),
});

export class ApiErrorDto extends createZodDto(ApiErrorSchema) {}
