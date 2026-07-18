import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { LocalStorageAdapter } from "../src/adapters/local"
import {
  verifyLocalDownloadSignature,
  buildLocalSignedDownloadUrl,
} from "../src/local-signed-url"

const TEST_SECRET = "test-signing-secret"

describe("LocalStorageAdapter", () => {
  let basePath: string
  let previousCwd: string

  afterEach(async () => {
    if (previousCwd) {
      process.chdir(previousCwd)
      previousCwd = ""
    }
    if (basePath) {
      await rm(basePath, { recursive: true, force: true })
    }
  })

  it("uploads a file and returns a signed download URL", async () => {
    basePath = await mkdtemp(join(tmpdir(), "theo-storage-"))
    const provider = new LocalStorageAdapter({
      provider: "local",
      basePath,
      baseUrl: "http://localhost:4000/uploads",
      signingSecret: TEST_SECRET,
    })

    const result = await provider.upload({
      path: "org/user/test.txt",
      body: Buffer.from("hello"),
      contentType: "text/plain",
    })

    expect(result.path).toBe("org/user/test.txt")
    expect(result.url).toContain(
      "http://localhost:4000/uploads/org/user/test.txt?"
    )
    expect(result.url).toContain("exp=")
    expect(result.url).toContain("sig=")

    const onDisk = await readFile(join(basePath, "org/user/test.txt"), "utf8")
    expect(onDisk).toBe("hello")
  })

  it("uploads with a relative basePath like ./uploads", async () => {
    basePath = await mkdtemp(join(tmpdir(), "theo-storage-"))
    await mkdir(join(basePath, "uploads"), { recursive: true })
    previousCwd = process.cwd()
    process.chdir(basePath)

    const provider = new LocalStorageAdapter({
      provider: "local",
      basePath: "./uploads",
      baseUrl: "http://localhost:4000/uploads",
      signingSecret: TEST_SECRET,
    })

    const result = await provider.upload({
      path: "org/user/nested.txt",
      body: Buffer.from("nested"),
      contentType: "text/plain",
    })

    expect(result.path).toBe("org/user/nested.txt")
    const onDisk = await readFile(
      join(basePath, "uploads", "org/user/nested.txt"),
      "utf8"
    )
    expect(onDisk).toBe("nested")
  })

  it("rejects path traversal", async () => {
    basePath = await mkdtemp(join(tmpdir(), "theo-storage-"))
    const provider = new LocalStorageAdapter({
      provider: "local",
      basePath,
      baseUrl: "http://localhost:4000/uploads",
      signingSecret: TEST_SECRET,
    })

    await expect(
      provider.upload({
        path: "../escape.txt",
        body: Buffer.from("nope"),
        contentType: "text/plain",
      })
    ).rejects.toMatchObject({ code: "INVALID_PATH" })
  })

  it("verifies signed download URLs and rejects bad or expired ones", async () => {
    const path = "org/user/secret.txt"
    const url = buildLocalSignedDownloadUrl(
      "http://localhost:4000/uploads",
      path,
      TEST_SECRET,
      60
    )
    const parsed = new URL(url)
    const exp = parsed.searchParams.get("exp")
    const sig = parsed.searchParams.get("sig")
    expect(exp).toBeTruthy()
    expect(sig).toBeTruthy()

    expect(
      verifyLocalDownloadSignature({
        path,
        exp: exp!,
        sig: sig!,
        signingSecret: TEST_SECRET,
      })
    ).toBe(true)

    expect(
      verifyLocalDownloadSignature({
        path,
        exp: exp!,
        sig: "deadbeef",
        signingSecret: TEST_SECRET,
      })
    ).toBe(false)

    expect(
      verifyLocalDownloadSignature({
        path,
        exp: String(Math.floor(Date.now() / 1000) - 10),
        sig: sig!,
        signingSecret: TEST_SECRET,
      })
    ).toBe(false)
  })
})
