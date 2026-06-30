import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"
import type { Response } from "express"
import { Observable, map } from "rxjs"

export interface ApiResponse<T = unknown> {
  data: T
}

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponse | undefined> {
    if (context.getType() !== "http") return next.handle()

    const response = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      map((data) => {
        if (response.statusCode === 204) return undefined
        return { data }
      })
    )
  }
}
