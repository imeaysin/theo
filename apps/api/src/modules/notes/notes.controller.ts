import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common"
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger"
import {
  MemberHasPermission,
  Session,
  type UserSession,
} from "@/common/decorators"
import { ApiAuthErrorResponses } from "@/common/decorators/api-error-responses.decorator"
import { requireActiveOrganizationId } from "@/common/session-context"
import { NotesService } from "./notes.service"
import {
  BulkDeleteNotesApiResponseDto,
  BulkDeleteNotesDto,
  CreateNoteDto,
  NoteApiResponseDto,
  NotesListApiResponseDto,
  UpdateNoteDto,
} from "./dto"

@ApiTags("notes")
@ApiAuthErrorResponses()
@Controller({ path: "notes", version: "1" })
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @MemberHasPermission({ permissions: { project: ["read"] } })
  @ApiOperation({ summary: "List notes" })
  @ApiOkResponse({ type: NotesListApiResponseDto })
  async list(@Session() session: UserSession) {
    return this.notesService.listNotes({
      organizationId: requireActiveOrganizationId(session),
      userId: session.user.id,
    })
  }

  @Post()
  @MemberHasPermission({ permissions: { project: ["create"] } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a note" })
  @ApiCreatedResponse({ type: NoteApiResponseDto })
  create(@Session() session: UserSession, @Body() body: CreateNoteDto) {
    return this.notesService.createNote(
      {
        organizationId: requireActiveOrganizationId(session),
        userId: session.user.id,
      },
      body
    )
  }

  @Post("bulk-delete")
  @MemberHasPermission({ permissions: { project: ["delete"] } })
  @ApiOperation({ summary: "Bulk delete notes" })
  @ApiOkResponse({ type: BulkDeleteNotesApiResponseDto })
  bulkDelete(
    @Session() session: UserSession,
    @Body() body: BulkDeleteNotesDto
  ) {
    return this.notesService.bulkDeleteNotes({
      organizationId: requireActiveOrganizationId(session),
      userId: session.user.id,
      ids: body.ids,
    })
  }

  @Patch(":id")
  @MemberHasPermission({ permissions: { project: ["update"] } })
  @ApiOperation({ summary: "Update a note" })
  @ApiParam({ name: "id", description: "Note id" })
  @ApiOkResponse({ type: NoteApiResponseDto })
  update(
    @Session() session: UserSession,
    @Param("id") id: string,
    @Body() body: UpdateNoteDto
  ) {
    return this.notesService.updateNote(
      {
        organizationId: requireActiveOrganizationId(session),
        userId: session.user.id,
        noteId: id,
      },
      body
    )
  }

  @Delete(":id")
  @MemberHasPermission({ permissions: { project: ["delete"] } })
  @HttpCode(204)
  @ApiOperation({ summary: "Delete a note" })
  @ApiParam({ name: "id", description: "Note id" })
  @ApiNoContentResponse({ description: "Note deleted" })
  remove(@Session() session: UserSession, @Param("id") id: string) {
    return this.notesService.deleteNote({
      organizationId: requireActiveOrganizationId(session),
      userId: session.user.id,
      noteId: id,
    })
  }
}
