import {
  mkdir,
  writeFile,
  unlink,
  access,
  stat,
  readdir,
  copyFile,
  rename,
} from "node:fs/promises"
import { join, dirname } from "node:path"
import type {
  StorageProvider,
  StorageUploadInput,
  StorageUploadResult,
  StorageDeleteInput,
  StorageCopyInput,
  StorageCopyResult,
  StorageMoveInput,
  StorageMoveResult,
  StorageListInput,
  StorageListResult,
  StorageListEntry,
  StorageFileMetadata,
  SignedUrlOptions,
  LocalStorageConfig,
} from "../types"
import { StorageError } from "../types"

export class LocalStorageProvider implements StorageProvider {
  private readonly basePath: string
  private readonly baseUrl: string

  constructor(config: LocalStorageConfig) {
    this.basePath = config.basePath.replace(/\/+$/, "")
    this.baseUrl = config.baseUrl.replace(/\/+$/, "")
  }

  private resolve(path: string): string {
    const normalized = path.replace(/^\/+/, "")
    const resolved = join(this.basePath, normalized)

    if (!resolved.startsWith(this.basePath)) {
      throw new StorageError(`Path traversal detected: ${path}`, "INVALID_PATH")
    }

    return resolved
  }

  async upload(input: StorageUploadInput): Promise<StorageUploadResult> {
    const fullPath = this.resolve(input.path)
    await mkdir(dirname(fullPath), { recursive: true })

    try {
      await writeFile(fullPath, input.body)
    } catch (cause) {
      throw new StorageError(
        `Upload failed: ${input.path}`,
        "UPLOAD_FAILED",
        cause
      )
    }

    return {
      path: input.path,
      url: this.getUrl(input.path),
    }
  }

  async delete(input: StorageDeleteInput): Promise<void> {
    const fullPath = this.resolve(input.path)

    try {
      await unlink(fullPath)
    } catch (cause) {
      const nodeErr = cause as NodeJS.ErrnoException
      if (nodeErr.code === "ENOENT") {
        throw new StorageError(
          `File not found: ${input.path}`,
          "FILE_NOT_FOUND",
          cause
        )
      }
      throw new StorageError(
        `Delete failed: ${input.path}`,
        "DELETE_FAILED",
        cause
      )
    }
  }

  getUrl(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\/+/, "")}`
  }

  async exists(path: string): Promise<boolean> {
    try {
      await access(this.resolve(path))
      return true
    } catch {
      return false
    }
  }

  async copy(input: StorageCopyInput): Promise<StorageCopyResult> {
    const sourceFull = this.resolve(input.sourcePath)
    const destFull = this.resolve(input.destinationPath)

    try {
      await mkdir(dirname(destFull), { recursive: true })
      await copyFile(sourceFull, destFull)
    } catch (cause) {
      const nodeErr = cause as NodeJS.ErrnoException
      if (nodeErr.code === "ENOENT") {
        throw new StorageError(
          `Source file not found: ${input.sourcePath}`,
          "FILE_NOT_FOUND",
          cause
        )
      }
      throw new StorageError(
        `Copy failed: ${input.sourcePath} -> ${input.destinationPath}`,
        "COPY_FAILED",
        cause
      )
    }

    return {
      path: input.destinationPath,
      url: this.getUrl(input.destinationPath),
    }
  }

  async move(input: StorageMoveInput): Promise<StorageMoveResult> {
    const sourceFull = this.resolve(input.sourcePath)
    const destFull = this.resolve(input.destinationPath)

    try {
      await mkdir(dirname(destFull), { recursive: true })
      await rename(sourceFull, destFull)
    } catch (cause) {
      const nodeErr = cause as NodeJS.ErrnoException
      if (nodeErr.code === "ENOENT") {
        throw new StorageError(
          `Source file not found: ${input.sourcePath}`,
          "FILE_NOT_FOUND",
          cause
        )
      }
      throw new StorageError(
        `Move failed: ${input.sourcePath} -> ${input.destinationPath}`,
        "MOVE_FAILED",
        cause
      )
    }

    return {
      path: input.destinationPath,
      url: this.getUrl(input.destinationPath),
    }
  }

  async list(input?: StorageListInput): Promise<StorageListResult> {
    const dirPath = input?.prefix ? this.resolve(input.prefix) : this.basePath
    const dirRelative = input?.prefix ?? ""

    let entries
    try {
      entries = await readdir(dirPath, { withFileTypes: true })
    } catch (cause) {
      throw new StorageError(
        `List failed: ${dirRelative || "/"}`,
        "LIST_FAILED",
        cause
      )
    }

    const files: StorageListEntry[] = []
    const prefixes: string[] = []
    let count = 0
    const maxKeys = input?.maxKeys ?? Infinity

    for (const entry of entries) {
      if (count >= maxKeys) break

      const entryPath = dirRelative
        ? `${dirRelative}/${entry.name}`
        : entry.name

      if (entry.isDirectory()) {
        prefixes.push(`${entryPath}/`)
        count++
      } else if (entry.isFile()) {
        const stats = await stat(join(dirPath, entry.name))
        files.push({
          path: entryPath,
          size: stats.size,
          lastModified: stats.mtime,
        })
        count++
      }
    }

    return {
      files,
      prefixes,
      isTruncated: count >= maxKeys && entries.length > maxKeys,
    }
  }

  async metadata(path: string): Promise<StorageFileMetadata | null> {
    try {
      const fullPath = this.resolve(path)
      const stats = await stat(fullPath)
      return {
        size: stats.size,
        contentType: "application/octet-stream",
        lastModified: stats.mtime,
      }
    } catch (cause) {
      const nodeErr = cause as NodeJS.ErrnoException
      if (nodeErr.code === "ENOENT") return null
      throw new StorageError(
        `Metadata retrieval failed: ${path}`,
        "PROVIDER_ERROR",
        cause
      )
    }
  }

  async getSignedDownloadUrl(
    path: string,
    _options?: SignedUrlOptions
  ): Promise<string> {
    return this.getUrl(path)
  }

  async getSignedUploadUrl(
    _path: string,
    _options?: SignedUrlOptions
  ): Promise<string> {
    throw new StorageError(
      "Local storage does not support signed upload URLs",
      "UNSUPPORTED_OPERATION"
    )
  }
}
