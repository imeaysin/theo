import { z } from "zod"

type ApiEnvelopeMeta = {
  id: string
  title?: string
  description?: string
  [key: string]: unknown
}

export const ApiFieldErrorSchema = z
  .object({
    field: z.string().describe("Field path that failed validation"),
    message: z.string().describe("Human-readable constraint message"),
  })
  .meta({
    id: "ApiFieldError",
    title: "Field error",
    description: "A single validation failure for one field.",
  })

export const ApiErrorResponseSchema = z
  .object({
    success: z.literal(false).describe("Always false for error responses"),
    statusCode: z.number().int().describe("HTTP status code"),
    code: z
      .string()
      .describe("Machine-readable business error token")
      .meta({ examples: ["VALIDATION_FAILED"] }),
    message: z
      .string()
      .describe("Human-readable diagnostic summary")
      .meta({ examples: ["Validation failed"] }),
    errors: z
      .array(ApiFieldErrorSchema)
      .nullable()
      .optional()
      .describe("Contextual field errors or array details"),
    path: z
      .string()
      .describe("Request path")
      .meta({ examples: ["/v1/notes"] }),
    timestamp: z
      .string()
      .describe("ISO-8601 response timestamp")
      .meta({ examples: ["2026-07-01T03:45:00.000Z"] }),
  })
  .meta({
    id: "ApiErrorResponseDto",
    title: "Error response",
    description: "Unified machine-readable error envelope.",
  })

const defaultSuccessMessage = "Operation completed successfully"

/** Standard success envelope applied by the API response interceptor. */
export function apiSuccessResponse<T extends z.ZodType>(
  payload: T,
  meta?: ApiEnvelopeMeta
) {
  const envelope = z.object({
    success: z.literal(true).describe("Always true for successful responses"),
    statusCode: z.number().int().describe("HTTP status code"),
    message: z
      .string()
      .describe("Human-readable summary")
      .meta({ examples: [defaultSuccessMessage] }),
    data: payload.describe("Response payload"),
    timestamp: z
      .string()
      .describe("ISO-8601 response timestamp")
      .meta({ examples: ["2026-07-01T03:45:00.000Z"] }),
  })

  return meta ? envelope.meta(meta) : envelope
}

export type ApiFieldError = z.infer<typeof ApiFieldErrorSchema>
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>

export type ApiSuccessResponse<T> = {
  success: true
  statusCode: number
  message: string
  data: T
  timestamp: string
}
