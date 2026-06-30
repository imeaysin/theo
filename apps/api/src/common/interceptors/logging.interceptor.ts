import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common"
import type { Request, Response } from "express"
import { Observable, tap } from "rxjs"

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP")

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") return next.handle()

    const request = context.switchToHttp().getRequest<Request>()
    const { method, url } = request
    const started = Date.now()

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>()
        this.logger.log(
          `${method} ${url} ${response.statusCode} - ${Date.now() - started}ms`
        )
      })
    )
  }
}
