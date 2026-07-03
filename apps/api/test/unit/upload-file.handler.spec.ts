import { BadRequestException } from "@nestjs/common"
import { Test, type TestingModule } from "@nestjs/testing"
import type { UploadResponse } from "@workspace/contracts"
import { UploadFileHandler } from "../../src/modules/uploads/commands/upload-file.handler"
import { UploadFileCommand } from "../../src/modules/uploads/commands/upload-file.command"
import { StorageRepository } from "../../src/modules/uploads/repositories/storage.repository"

describe("UploadFileHandler", () => {
  let handler: UploadFileHandler
  let storage: { upload: jest.Mock }

  beforeEach(async () => {
    storage = { upload: jest.fn() }

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UploadFileHandler,
        { provide: StorageRepository, useValue: storage },
      ],
    }).compile()

    handler = moduleRef.get(UploadFileHandler)
  })

  it("uploads under org/user with a sanitized filename", async () => {
    storage.upload.mockResolvedValue({
      path: "org-1/user-1/uuid-hello.png",
      url: "/uploads/org-1/user-1/uuid-hello.png",
      contentLength: 4,
    })

    const result = await handler.execute(
      new UploadFileCommand("org-1", "user-1", {
        buffer: Buffer.from("data"),
        originalname: "hello world!.png",
        mimetype: "image/png",
        size: 4,
      })
    )

    expect(storage.upload).toHaveBeenCalledWith(
      expect.objectContaining({
        path: expect.stringMatching(/^org-1\/user-1\/[\w-]+-hello_world_.png$/),
        contentType: "image/png",
        contentLength: 4,
      })
    )
    expect(result).toEqual({
      path: "org-1/user-1/uuid-hello.png",
      url: "/uploads/org-1/user-1/uuid-hello.png",
      contentLength: 4,
    } satisfies UploadResponse)
  })

  it("rejects when no file is provided", async () => {
    await expect(
      handler.execute(new UploadFileCommand("org-1", "user-1"))
    ).rejects.toBeInstanceOf(BadRequestException)

    expect(storage.upload).not.toHaveBeenCalled()
  })
})
