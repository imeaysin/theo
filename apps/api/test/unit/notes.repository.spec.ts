import { ConflictException } from "@nestjs/common"
import { Test, type TestingModule } from "@nestjs/testing"
import { ObjectId, type Db } from "mongodb"
import { MONGO_DB } from "@/common/database/database.module"
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_MAX_LIMIT,
} from "@/common/database/repositories"
import { NotesRepository } from "@/modules/notes/repositories/notes.repository"
import type { NoteEntity } from "@/modules/notes/entities/note.entity"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeNote(partial: Partial<NoteEntity> = {}): NoteEntity {
  return {
    _id: new ObjectId(),
    organizationId: "org-1",
    userId: "user-1",
    title: "Test note",
    body: "Test body",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...partial,
  }
}

/** Builds a jest mock that looks enough like a MongoDB `Collection`. */
function makeCollection() {
  const cursor = {
    sort: jest.fn().mockReturnThis(),
    toArray: jest.fn().mockResolvedValue([]),
  }

  return {
    find: jest.fn().mockReturnValue(cursor),
    findOne: jest.fn(),
    insertOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
    _cursor: cursor,
  }
}

// ─── Test suite ───────────────────────────────────────────────────────────────

describe("NotesRepository", () => {
  let repository: NotesRepository
  let col: ReturnType<typeof makeCollection>

  beforeEach(async () => {
    col = makeCollection()

    const db = {
      collection: jest.fn().mockReturnValue(col),
    } as unknown as Db

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [NotesRepository, { provide: MONGO_DB, useValue: db }],
    }).compile()

    repository = moduleRef.get(NotesRepository)
  })

  // ─── findById ───────────────────────────────────────────────────────────────

  describe("findById", () => {
    it("returns null for an invalid ObjectId string", async () => {
      const result = await repository.findById("not-a-valid-id")
      expect(col.findOne).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it("returns null when the collection returns null (document not found)", async () => {
      col.findOne.mockResolvedValue(null)
      const result = await repository.findById(new ObjectId().toString())
      expect(result).toBeNull()
    })

    it("returns the entity when the document exists", async () => {
      const note = makeNote()
      col.findOne.mockResolvedValue(note)
      const result = await repository.findById(note._id.toString())
      expect(result).toEqual(note)
    })
  })

  // ─── insert ─────────────────────────────────────────────────────────────────

  describe("insert", () => {
    it("returns the created entity with generated _id and timestamps", async () => {
      const insertedId = new ObjectId()
      col.insertOne.mockResolvedValue({ insertedId })

      const result = await repository.insert({
        organizationId: "org-1",
        userId: "user-1",
        title: "Hello",
        body: "World",
      })

      expect(result._id).toEqual(insertedId)
      expect(result.title).toBe("Hello")
      expect(result.body).toBe("World")
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })

    it("maps a MongoDB E11000 duplicate-key error to ConflictException", async () => {
      const mongoError = Object.assign(new Error("E11000 duplicate key"), {
        code: 11000,
      })
      col.insertOne.mockRejectedValue(mongoError)

      await expect(
        repository.insert({
          organizationId: "org-1",
          userId: "user-1",
          title: "Dup",
          body: "",
        })
      ).rejects.toBeInstanceOf(ConflictException)
    })

    it("re-throws non-duplicate errors unchanged", async () => {
      const networkError = new Error("network timeout")
      col.insertOne.mockRejectedValue(networkError)

      await expect(
        repository.insert({
          organizationId: "org-1",
          userId: "user-1",
          title: "Title",
          body: "",
        })
      ).rejects.toThrow("network timeout")
    })
  })

  // ─── update ─────────────────────────────────────────────────────────────────

  describe("update", () => {
    it("returns null for an invalid noteId", async () => {
      const result = await repository.update(
        { organizationId: "org-1", userId: "user-1", noteId: "bad-id" },
        { title: "Updated" }
      )
      expect(col.findOneAndUpdate).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it("returns null when the driver returns null (document not found)", async () => {
      col.findOneAndUpdate.mockResolvedValue(null)
      const result = await repository.update(
        {
          organizationId: "org-1",
          userId: "user-1",
          noteId: new ObjectId().toString(),
        },
        { title: "Updated" }
      )
      expect(result).toBeNull()
    })

    it("returns the updated entity when found", async () => {
      const note = makeNote({ title: "Updated" })
      col.findOneAndUpdate.mockResolvedValue(note)
      const result = await repository.update(
        {
          organizationId: "org-1",
          userId: "user-1",
          noteId: note._id.toString(),
        },
        { title: "Updated" }
      )
      expect(result).toEqual(note)
    })
  })

  // ─── delete ─────────────────────────────────────────────────────────────────

  describe("delete", () => {
    it("returns false for an invalid noteId without calling the driver", async () => {
      const result = await repository.delete({
        organizationId: "org-1",
        userId: "user-1",
        noteId: "bad-id",
      })
      expect(col.deleteOne).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it("returns false when deletedCount is 0 (document not found)", async () => {
      col.deleteOne.mockResolvedValue({ deletedCount: 0 })
      const result = await repository.delete({
        organizationId: "org-1",
        userId: "user-1",
        noteId: new ObjectId().toString(),
      })
      expect(result).toBe(false)
    })

    it("returns true when a document was deleted", async () => {
      col.deleteOne.mockResolvedValue({ deletedCount: 1 })
      const result = await repository.delete({
        organizationId: "org-1",
        userId: "user-1",
        noteId: new ObjectId().toString(),
      })
      expect(result).toBe(true)
    })
  })

  // ─── Pagination helpers ──────────────────────────────────────────────────────

  describe("paginate (BaseMongoRepository)", () => {
    // We call paginate via a thin test subclass so we don't couple the test
    // to a specific method that happens to use it today.
    class TestablePaginator extends NotesRepository {
      expose(opts: { page: number; limit: number }) {
        return this.paginate(opts)
      }
    }

    let pager: TestablePaginator

    beforeEach(async () => {
      const col2 = makeCollection()
      const db2 = {
        collection: jest.fn().mockReturnValue(col2),
      } as unknown as Db

      const mod = await Test.createTestingModule({
        providers: [TestablePaginator, { provide: MONGO_DB, useValue: db2 }],
      }).compile()

      pager = mod.get(TestablePaginator)
    })

    it("clamps page ≤ 0 to 1", () => {
      expect(pager.expose({ page: 0, limit: 10 }).page).toBe(1)
      expect(pager.expose({ page: -5, limit: 10 }).page).toBe(1)
    })

    it("clamps limit ≤ 0 to the default limit", () => {
      expect(pager.expose({ page: 1, limit: 0 }).limit).toBe(
        PAGINATION_DEFAULT_LIMIT
      )
      expect(pager.expose({ page: 1, limit: -1 }).limit).toBe(
        PAGINATION_DEFAULT_LIMIT
      )
    })

    it("clamps oversized limit to the maximum", () => {
      expect(pager.expose({ page: 1, limit: 99999 }).limit).toBe(
        PAGINATION_MAX_LIMIT
      )
    })

    it("computes the correct skip for page 2 with limit 10", () => {
      expect(pager.expose({ page: 2, limit: 10 }).skip).toBe(10)
    })

    it("computes skip = 0 for page 1", () => {
      expect(pager.expose({ page: 1, limit: 20 }).skip).toBe(0)
    })
  })
})
