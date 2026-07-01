import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger"
import type { JwtClaims } from "@workspace/auth/types"
import { NotesListResponseSchema } from "@workspace/contracts"
import { CurrentUser } from "../../common/decorators"
import { ApiAuthErrorResponses } from "../../common/decorators/api-error-responses.decorator"
import { BulkDeleteNotesCommand } from "./commands/bulk-delete-notes.command"
import { CreateNoteCommand } from "./commands/create-note.command"
import { DeleteNoteCommand } from "./commands/delete-note.command"
import { UpdateNoteCommand } from "./commands/update-note.command"
import {
  BulkDeleteNotesApiResponseDto,
  BulkDeleteNotesDto,
  CreateNoteDto,
  NoteApiResponseDto,
  NotesListApiResponseDto,
  UpdateNoteDto,
} from "./notes.dto"
import { ListNotesQuery } from "./queries/list-notes.query"

@ApiTags("notes")
@ApiAuthErrorResponses()
@Controller({ path: "notes", version: "1" })
export class NotesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "List notes",
    description: "Returns all notes owned by the authenticated user.",
  })
  @ApiOkResponse({ type: NotesListApiResponseDto })
  async list(@CurrentUser() user: JwtClaims) {
    const items = await this.queryBus.execute(new ListNotesQuery(user.id))
    return NotesListResponseSchema.parse({ items })
  }

  @Post()
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Create a note",
    description: "Creates a new note for the authenticated user.",
  })
  @ApiCreatedResponse({ type: NoteApiResponseDto })
  create(@CurrentUser() user: JwtClaims, @Body() body: CreateNoteDto) {
    return this.commandBus.execute(new CreateNoteCommand(user.id, body))
  }

  @Post("bulk-delete")
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Bulk delete notes",
    description: "Deletes up to 100 notes by id. Only owned notes are removed.",
  })
  @ApiOkResponse({ type: BulkDeleteNotesApiResponseDto })
  bulkDelete(@CurrentUser() user: JwtClaims, @Body() body: BulkDeleteNotesDto) {
    return this.commandBus.execute(new BulkDeleteNotesCommand(user.id, body))
  }

  @Patch(":id")
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Update a note",
    description: "Updates title and/or body of an owned note.",
  })
  @ApiParam({
    name: "id",
    description: "Note id",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiOkResponse({ type: NoteApiResponseDto })
  update(
    @CurrentUser() user: JwtClaims,
    @Param("id") id: string,
    @Body() body: UpdateNoteDto
  ) {
    return this.commandBus.execute(new UpdateNoteCommand(user.id, id, body))
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Delete a note",
    description: "Permanently deletes an owned note.",
  })
  @ApiParam({
    name: "id",
    description: "Note id",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiNoContentResponse({ description: "Note deleted" })
  remove(@CurrentUser() user: JwtClaims, @Param("id") id: string) {
    return this.commandBus.execute(new DeleteNoteCommand(user.id, id))
  }
}
