import { ForbiddenException, NotFoundException } from "@nestjs/common"
import { Test, type TestingModule } from "@nestjs/testing"
import { DeleteNoteHandler } from "../../src/modules/notes/commands/delete-note.handler"
import { DeleteNoteCommand } from "../../src/modules/notes/commands/delete-note.command"
import { NotesRepository } from "../../src/modules/notes/repositories/notes.repository"

describe("DeleteNoteHandler", () => {
  let handler: DeleteNoteHandler
  let repository: {
    deleteByIdForOrganizationAndUser: jest.Mock
    findById: jest.Mock
  }

  beforeEach(async () => {
    repository = {
      deleteByIdForOrganizationAndUser: jest.fn(),
      findById: jest.fn(),
    }

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteNoteHandler,
        { provide: NotesRepository, useValue: repository },
      ],
    }).compile()

    handler = moduleRef.get(DeleteNoteHandler)
  })

  it("deletes when the note belongs to the user in the workspace", async () => {
    repository.deleteByIdForOrganizationAndUser.mockResolvedValue(true)

    await expect(
      handler.execute(new DeleteNoteCommand("org-1", "user-1", "note-1"))
    ).resolves.toBeUndefined()

    expect(repository.findById).not.toHaveBeenCalled()
  })

  it("throws 404 when the note does not exist", async () => {
    repository.deleteByIdForOrganizationAndUser.mockResolvedValue(false)
    repository.findById.mockResolvedValue(null)

    await expect(
      handler.execute(new DeleteNoteCommand("org-1", "user-1", "note-1"))
    ).rejects.toBeInstanceOf(NotFoundException)
  })

  it("throws 404 when the note belongs to another workspace", async () => {
    repository.deleteByIdForOrganizationAndUser.mockResolvedValue(false)
    repository.findById.mockResolvedValue({
      id: "note-1",
      organizationId: "org-2",
      userId: "user-1",
      title: "t",
      body: "b",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await expect(
      handler.execute(new DeleteNoteCommand("org-1", "user-1", "note-1"))
    ).rejects.toBeInstanceOf(NotFoundException)
  })

  it("throws 403 when the note belongs to another user in the same workspace", async () => {
    repository.deleteByIdForOrganizationAndUser.mockResolvedValue(false)
    repository.findById.mockResolvedValue({
      id: "note-1",
      organizationId: "org-1",
      userId: "user-2",
      title: "t",
      body: "b",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await expect(
      handler.execute(new DeleteNoteCommand("org-1", "user-1", "note-1"))
    ).rejects.toBeInstanceOf(ForbiddenException)
  })
})
