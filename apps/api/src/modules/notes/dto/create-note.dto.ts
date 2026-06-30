import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

/** OpenAPI shape — validation uses `@workspace/contracts`. */
export class CreateNoteDto {
  @ApiProperty({ example: "Ship the dashboard" })
  title!: string

  @ApiPropertyOptional({ example: "Follow up with design review." })
  body?: string
}
