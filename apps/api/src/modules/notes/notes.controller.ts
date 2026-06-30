import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger"
import type { JWTClaims } from "@workspace/auth/types"
import {
  CreateNoteSchema,
  NotesListResponseSchema,
  type CreateNoteInput,
} from "@workspace/contracts"
import { CurrentUser } from "../../common/decorators"
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe"
import { CreateNoteCommand } from "./commands/create-note.command"
import { DeleteNoteCommand } from "./commands/delete-note.command"
import { CreateNoteDto } from "./dto/create-note.dto"
import { ListNotesQuery } from "./queries/list-notes.query"

@ApiTags("notes")
@Controller({ path: "notes", version: "1" })
export class NotesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  @ApiBearerAuth("bearer")
  @ApiOperation({ summary: "List notes for the current user" })
  @ApiOkResponse({ description: "User notes" })
  async list(@CurrentUser() user: JWTClaims) {
    const items = await this.queryBus.execute(new ListNotesQuery(user.id))
    return NotesListResponseSchema.parse({ items })
  }

  @Post()
  @ApiBearerAuth("bearer")
  @ApiOperation({ summary: "Create a note" })
  @ApiCreatedResponse({ description: "Created note" })
  @ApiBody({ type: CreateNoteDto })
  create(
    @CurrentUser() user: JWTClaims,
    @Body(new ZodValidationPipe(CreateNoteSchema)) body: CreateNoteInput
  ) {
    return this.commandBus.execute(new CreateNoteCommand(user.id, body))
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiBearerAuth("bearer")
  @ApiOperation({ summary: "Delete a note" })
  remove(@CurrentUser() user: JWTClaims, @Param("id") id: string) {
    return this.commandBus.execute(new DeleteNoteCommand(user.id, id))
  }
}
