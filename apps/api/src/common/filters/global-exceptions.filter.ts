import {
  ExceptionFilter,
  Catch,
  HttpStatus,
  type ArgumentsHost,
} from "@nestjs/common"
import { HttpAdapterHost } from "@nestjs/core"
import { SentryExceptionCaptured } from "@sentry/nestjs"
import { HttpErrorCode } from "@workspace/contracts"
import { createLogger, getRequestId } from "@workspace/logger"
import { createErrorEnvelope } from "./error-envelope.util"

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger = createLogger("Exceptions")

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  @SentryExceptionCaptured()
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()

    const request = ctx.getRequest()
    const response = ctx.getResponse()

    const status = HttpStatus.INTERNAL_SERVER_ERROR

    this.logServerError(
      httpAdapter.getRequestMethod(request),
      httpAdapter.getRequestUrl(request),
      exception
    )

    const envelope = createErrorEnvelope({
      status,
      code: HttpErrorCode.INTERNAL_SERVER_ERROR,
      message: "An unexpected server error occurred.",
      path: httpAdapter.getRequestUrl(request),
    })

    httpAdapter.reply(response, envelope, status)
  }

  private logServerError(method: string, url: string, exception: unknown) {
    const err =
      exception instanceof Error ? exception : { message: String(exception) }

    this.logger.error(
      {
        requestId: getRequestId(),
        method,
        url,
        err,
      },
      "unhandled server error"
    )
  }
}
