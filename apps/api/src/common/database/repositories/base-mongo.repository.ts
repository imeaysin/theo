import { ConflictException } from "@nestjs/common"
import { HttpErrorCode } from "@workspace/contracts"
import { clampPagination } from "./pagination"
import type { PaginationOptions } from "./pagination"

// E11000 is MongoDB's error code for unique index violations
const MONGO_DUPLICATE_KEY_ERROR = 11000

function hasNumericCode(value: unknown): value is { code: number } {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    typeof (value as Record<string, unknown>)["code"] === "number"
  )
}

export abstract class BaseMongoRepository {
  protected paginate(
    options: PaginationOptions
  ): PaginationOptions & { skip: number } {
    const clamped = clampPagination(options)
    return {
      ...clamped,
      skip: (clamped.page - 1) * clamped.limit,
    }
  }

  // Catches E11000 and rethrows as ConflictException so the raw driver error never leaks
  protected async guardInsert<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn()
    } catch (error: unknown) {
      if (hasNumericCode(error) && error.code === MONGO_DUPLICATE_KEY_ERROR) {
        throw new ConflictException("Resource already exists", {
          cause: HttpErrorCode.CONFLICT,
        })
      }
      throw error
    }
  }
}
