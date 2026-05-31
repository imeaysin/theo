import type { z } from "zod"

export function parseResponse<T extends z.ZodType>(
  schema: T,
  data: unknown,
  context: string,
): z.infer<T> {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new Error(
      `[api-client] Invalid ${context} response: ${result.error.message}`,
    )
  }
  return result.data
}
