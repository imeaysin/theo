import { CommandHandler } from "@nestjs/cqrs"
import { Test, type TestingModule } from "@nestjs/testing"
import type { NoteResponse } from "@workspace/contracts"
import { CreateNoteHandler } from "../../src/modules/notes/commands/create-note.handler"
import { CreateNoteCommand } from "../../src/modules/notes/commands/create-note.command"
import { NotesRepository } from "../../src/modules/notes/repositories/notes.repository"

describe("CreateNoteHandler", () => {
  let handler: CreateNoteHandler
  let repository: { insert: jest.Mock }

  beforeEach(async () => {
    repository = { insert: jest.fn() }

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreateNoteHandler,
        { provide: NotesRepository, useValue: repository },
      ],
    }).compile()

    handler = moduleRef.get(CreateNoteHandler)
  })

  it("inserts a note scoped to workspace and user", async () => {
    const now = new Date("2026-01-01T00:00:00.000Z")
    const created = {
      id: "note-1",
      organizationId: "org-1",
      userId: "user-1",
      title: "Hello",
      body: "World",
      createdAt: now,
      updatedAt: now,
    }
    repository.insert.mockResolvedValue(created)

    const result = await handler.execute(
      new CreateNoteCommand("org-1", "user-1", {
        title: "Hello",
        body: "World",
      })
    )

    expect(repository.insert).toHaveBeenCalledWith({
      organizationId: "org-1",
      userId: "user-1",
      title: "Hello",
      body: "World",
    })
    expect(result).toEqual({
      id: "note-1",
      organizationId: "org-1",
      userId: "user-1",
      title: "Hello",
      body: "World",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    } satisfies NoteResponse)
  })
})
