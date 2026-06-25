import { HttpException, HttpStatus } from "@nestjs/common"

export function resolveHttpStatus(exception: unknown): number {
  if (exception instanceof HttpException) {
    return exception.getStatus()
  }
  return HttpStatus.INTERNAL_SERVER_ERROR
}

export function resolveExceptionMessage(exception: unknown): string | string[] {
  if (!(exception instanceof HttpException)) {
    return "Internal server error"
  }

  const response = exception.getResponse()
  if (typeof response === "string") {
    return response
  }

  if (typeof response === "object" && response !== null && "message" in response) {
    const { message } = response as { message: string | string[] }
    return message
  }

  return "Internal server error"
}
