import { MeApiResponseSchema } from "@workspace/contracts"
import { createZodDto } from "nestjs-zod"

export class MeApiResponseDto extends createZodDto(MeApiResponseSchema) {}
