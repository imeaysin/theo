import { mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { LocalStorageProvider } from "../src/providers/local"

describe("LocalStorageProvider", () => {
  let basePath: string

  afterEach(async () => {
    if (basePath) {
      await rm(basePath, { recursive: true, force: true })
    }
  })

  it("uploads a file and returns a public URL", async () => {
    basePath = await mkdtemp(join(tmpdir(), "theo-storage-"))
    const provider = new LocalStorageProvider({
      provider: "local",
      basePath,
      baseUrl: "http://localhost:4000/uploads",
    })

    const result = await provider.upload({
      path: "org/user/test.txt",
      body: Buffer.from("hello"),
      contentType: "text/plain",
    })

    expect(result.path).toBe("org/user/test.txt")
    expect(result.url).toBe("http://localhost:4000/uploads/org/user/test.txt")

    const onDisk = await readFile(join(basePath, "org/user/test.txt"), "utf8")
    expect(onDisk).toBe("hello")
  })

  it("rejects path traversal", async () => {
    basePath = await mkdtemp(join(tmpdir(), "theo-storage-"))
    const provider = new LocalStorageProvider({
      provider: "local",
      basePath,
      baseUrl: "http://localhost:4000/uploads",
    })

    await expect(
      provider.upload({
        path: "../escape.txt",
        body: Buffer.from("nope"),
        contentType: "text/plain",
      })
    ).rejects.toMatchObject({ code: "INVALID_PATH" })
  })
})
