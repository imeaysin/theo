import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

/**
 * @description Parse request body using Zod schema.
 * @param {z.ZodTypeAny} schema - Zod schema for validation
 * @param {unknown} body - Request body to parse
 * @returns {z.infer<T>} Parsed and validated body
 */
export function parseBody<T extends z.ZodTypeAny>(
  schema: T,
  body: unknown,
): z.infer<T> {
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestException(error.flatten().fieldErrors);
    }

    throw error;
  }
}
