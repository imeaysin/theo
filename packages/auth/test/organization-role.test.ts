import { describe, expect, it } from "vitest"
import { ObjectId } from "mongodb"
import { toMongoId } from "../src/db/mongo"

describe("toMongoId", () => {
  it("converts valid object id strings", () => {
    const id = "507f1f77bcf86cd799439011"
    expect(toMongoId(id)).toBeInstanceOf(ObjectId)
    expect(toMongoId(id).toString()).toBe(id)
  })

  it("returns the original value for non-object-id strings", () => {
    expect(toMongoId("not-an-object-id")).toBe("not-an-object-id")
  })
})
