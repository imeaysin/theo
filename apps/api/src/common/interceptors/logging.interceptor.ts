import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"
import { createLogger } from "@workspace/logger"
import type { Request, Response } from "express"
import { Observable, tap } from "rxjs"

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = createLogger("HTTP")

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") return next.handle()

    const request = context.switchToHttp().getRequest<Request>()
    const { method, url } = request
    const started = Date.now()

    const log = (statusCode: number, err?: unknown) => {
      const durationMs = Date.now() - started
      const payload = err
        ? { method, url, statusCode, durationMs, err }
        : { method, url, statusCode, durationMs }
      const message = `${method} ${url} ${statusCode} ${durationMs}ms`

      if (statusCode >= 500) {
        this.logger.error(payload, message)
      } else if (statusCode >= 400) {
        this.logger.warn(payload, message)
      } else {
        this.logger.info(payload, message)
      }
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>()
          log(response.statusCode)
        },
        error: (err: unknown) => {
          const statusCode =
            err instanceof HttpException ? err.getStatus() : 500
          log(statusCode, err)
        },
      })
    )
  }
}
