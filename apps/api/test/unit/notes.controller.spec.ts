import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Test, type TestingModule } from "@nestjs/testing"
import type { JwtClaims } from "@workspace/auth/types"
import { CreateNoteCommand } from "../../src/modules/notes/commands/create-note.command"
import { NotesController } from "../../src/modules/notes/notes.controller"
import { ListNotesQuery } from "../../src/modules/notes/queries/list-notes.query"

describe("NotesController", () => {
  let controller: NotesController
  let commandBus: { execute: jest.Mock }
  let queryBus: { execute: jest.Mock }

  const organizationId = "org-1"
  const user = {
    id: "user-1",
    email: "user@example.com",
    role: "user",
    name: "User",
    activeOrganizationId: organizationId,
    organizationRole: "owner",
  } satisfies JwtClaims

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        { provide: CommandBus, useValue: { execute: jest.fn() } },
        { provide: QueryBus, useValue: { execute: jest.fn() } },
      ],
    }).compile()

    controller = moduleRef.get(NotesController)
    commandBus = moduleRef.get(CommandBus)
    queryBus = moduleRef.get(QueryBus)
  })

  it("list executes ListNotesQuery with workspace and user scope", async () => {
    const items = { items: [] }
    queryBus.execute.mockResolvedValue(items)

    await expect(controller.list(organizationId, user)).resolves.toBe(items)
    expect(queryBus.execute).toHaveBeenCalledWith(
      new ListNotesQuery(organizationId, user.id)
    )
  })

  it("create executes CreateNoteCommand with workspace and user scope", async () => {
    const body = { title: "Hello", body: "World" }
    const created = { id: "note-1", organizationId, userId: user.id, ...body }
    commandBus.execute.mockResolvedValue(created)

    await expect(controller.create(organizationId, user, body)).resolves.toBe(
      created
    )
    expect(commandBus.execute).toHaveBeenCalledWith(
      new CreateNoteCommand(organizationId, user.id, body)
    )
  })
})
