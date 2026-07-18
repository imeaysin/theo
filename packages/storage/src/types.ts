/**
 * Represents a storage error.
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: StorageErrorCode,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = "StorageError"
  }
}

export type StorageErrorCode =
  | "FILE_NOT_FOUND"
  | "UPLOAD_FAILED"
  | "DELETE_FAILED"
  | "COPY_FAILED"
  | "MOVE_FAILED"
  | "LIST_FAILED"
  | "INVALID_PATH"
  | "UNSUPPORTED_OPERATION"
  | "PROVIDER_ERROR"

export type StorageUploadBody = Buffer | Uint8Array

export type StorageUploadInput = {
  path: string
  body: StorageUploadBody
  contentType: string
  contentLength?: number
  cacheControl?: string
  metadata?: Record<string, string>
}

export type StorageUploadResult = {
  path: string
  url: string
  etag?: string
  contentLength?: number
}

export type StorageDeleteInput = {
  path: string
}

export type StorageCopyInput = {
  sourcePath: string
  destinationPath: string
}

export type StorageCopyResult = {
  path: string
  url: string
}

export type StorageMoveInput = {
  sourcePath: string
  destinationPath: string
}

export type StorageMoveResult = {
  path: string
  url: string
}

export type StorageListInput = {
  prefix?: string
  delimiter?: string
  maxKeys?: number
}

export type StorageListEntry = {
  path: string
  size: number
  lastModified: Date
  etag?: string
}

export type StorageListResult = {
  files: StorageListEntry[]
  prefixes: string[]
  isTruncated: boolean
}

export type StorageFileMetadata = {
  size: number
  contentType: string
  lastModified: Date
  etag?: string
  metadata?: Record<string, string>
}

export type SignedUrlOptions = {
  expiresInSeconds?: number
  contentType?: string
}

/**
 * Interface defining the operations supported by a storage provider.
 */
export type StorageProvider = {
  upload(input: StorageUploadInput): Promise<StorageUploadResult>
  delete(input: StorageDeleteInput): Promise<void>
  getUrl(path: string): string
  exists(path: string): Promise<boolean>
  copy(input: StorageCopyInput): Promise<StorageCopyResult>
  move(input: StorageMoveInput): Promise<StorageMoveResult>
  list(input?: StorageListInput): Promise<StorageListResult>
  metadata(path: string): Promise<StorageFileMetadata | null>
  getSignedDownloadUrl(
    path: string,
    options?: SignedUrlOptions
  ): Promise<string>
  getSignedUploadUrl(path: string, options?: SignedUrlOptions): Promise<string>
}

export type LocalStorageConfig = {
  provider: "local"
  basePath: string
  baseUrl: string
  /** HMAC secret for time-limited download URLs. */
  signingSecret: string
}

export type S3StorageConfig = {
  provider: "s3"
  bucket: string
  region: string
  endpoint?: string
  accessKeyId: string
  secretAccessKey: string
  baseUrl?: string
}

/**
 * Configuration for the storage system.
 */
export type StorageConfig = LocalStorageConfig | S3StorageConfig
