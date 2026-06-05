import { randomUUID } from "node:crypto"
import type { StorageConfig, StorageProvider } from "./types"
import { StorageError } from "./types"
import { LocalStorageProvider } from "./providers/local"
import { S3StorageProvider } from "./providers/s3"

export { StorageError, type StorageErrorCode } from "./types"
export type {
  StorageProvider,
  StorageConfig,
  StorageUploadInput,
  StorageUploadBody,
  StorageUploadResult,
  StorageDeleteInput,
  StorageCopyInput,
  StorageCopyResult,
  StorageMoveInput,
  StorageMoveResult,
  StorageListInput,
  StorageListEntry,
  StorageListResult,
  StorageFileMetadata,
  SignedUrlOptions,
  LocalStorageConfig,
  S3StorageConfig,
} from "./types"

export { LocalStorageProvider } from "./providers/local"
export { S3StorageProvider } from "./providers/s3"

export function createStorage(config: StorageConfig): StorageProvider {
  switch (config.provider) {
    case "local":
      return new LocalStorageProvider(config)
    case "s3":
      return new S3StorageProvider(config)
    default: {
      const _exhaustive: never = config
      throw new Error(`Unknown storage provider: ${_exhaustive}`)
    }
  }
}

export async function uploadFromUrl(
  storage: StorageProvider,
  url: string,
): Promise<{ url: string; path: string }> {
  let response: Response
  try {
    response = await fetch(url)
  } catch {
    throw new StorageError(`Failed to fetch URL: ${url}`, "UPLOAD_FAILED")
  }

  if (!response.ok) {
    throw new StorageError(
      `Failed to fetch URL: ${url} (${response.status})`,
      "UPLOAD_FAILED",
    )
  }

  const contentType = response.headers.get("content-type") ?? "application/octet-stream"
  const buffer = Buffer.from(await response.arrayBuffer())
  const path = `imports/${randomUUID()}`

  const result = await storage.upload({ path, body: buffer, contentType })

  return { url: result.url, path: result.path }
}
