import { describe, expect, it } from "vitest"
import { z } from "zod"
import { parseResponse } from "@src/lib/parse-response"

describe("parseResponse", () => {
  const schema = z.object({ id: z.string() })

  it("returns parsed data when valid", () => {
    expect(parseResponse(schema, { id: "1" }, "test")).toEqual({ id: "1" })
  })

  it("throws when response does not match schema", () => {
    expect(() => parseResponse(schema, { id: 1 }, "test")).toThrow(
      /Invalid test response/
    )
  })
})
