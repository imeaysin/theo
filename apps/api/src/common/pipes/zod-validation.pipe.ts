import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common"
import type { ZodType } from "zod"

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value)
    if (result.success) return result.data

    throw new BadRequestException({
      message: "Validation failed",
      errors: result.error.flatten(),
    })
  }
}
