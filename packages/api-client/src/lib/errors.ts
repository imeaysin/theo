import { z } from "zod"

export const ApiErrorBodySchema = z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.record(z.string(), z.array(z.string()))]),
  error: z.string().optional(),
})

export type ApiErrorBody = z.infer<typeof ApiErrorBodySchema>

/** Thrown when the API returns a non-2xx response. */
export class ApiError extends Error {
  readonly status: number
  readonly statusText: string
  readonly body: ApiErrorBody | unknown

  constructor(status: number, statusText: string, body: unknown) {
    const parsed = ApiErrorBodySchema.safeParse(body)
    const message = parsed.success
      ? formatApiErrorMessage(parsed.data)
      : `API Error ${status}: ${statusText}`

    super(message)
    this.name = "ApiError"
    this.status = status
    this.statusText = statusText
    this.body = parsed.success ? parsed.data : body
  }

  get isUnauthorized(): boolean {
    return this.status === 401
  }

  get isForbidden(): boolean {
    return this.status === 403
  }

  get isNotFound(): boolean {
    return this.status === 404
  }

  get isValidationError(): boolean {
    return this.status === 400
  }
}

function formatApiErrorMessage(body: ApiErrorBody): string {
  if (typeof body.message === "string") return body.message
  const parts = Object.entries(body.message).flatMap(([field, errors]) =>
    errors.map((msg) => `${field}: ${msg}`),
  )
  return parts.join("; ") || body.error || "Request failed"
}
