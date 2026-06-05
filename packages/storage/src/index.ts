import type { StorageConfig, StorageProvider } from "./types"
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
