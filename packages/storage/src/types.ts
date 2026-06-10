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

export interface StorageUploadInput {
  path: string
  body: StorageUploadBody
  contentType: string
  contentLength?: number
  cacheControl?: string
  metadata?: Record<string, string>
}

export interface StorageUploadResult {
  path: string
  url: string
  etag?: string
  contentLength?: number
}

// ── Delete ──────────────────────────────────────────

export interface StorageDeleteInput {
  path: string
}

// ── Copy / Move ─────────────────────────────────────

export interface StorageCopyInput {
  sourcePath: string
  destinationPath: string
}

export interface StorageCopyResult {
  path: string
  url: string
}

export interface StorageMoveInput {
  sourcePath: string
  destinationPath: string
}

export interface StorageMoveResult {
  path: string
  url: string
}

// ── List ────────────────────────────────────────────

export interface StorageListInput {
  prefix?: string
  delimiter?: string
  maxKeys?: number
}

export interface StorageListEntry {
  path: string
  size: number
  lastModified: Date
  etag?: string
}

export interface StorageListResult {
  files: StorageListEntry[]
  prefixes: string[]
  isTruncated: boolean
}

// ── Metadata ────────────────────────────────────────

export interface StorageFileMetadata {
  size: number
  contentType: string
  lastModified: Date
  etag?: string
  metadata?: Record<string, string>
}

// ── Signed URLs ─────────────────────────────────────

export interface SignedUrlOptions {
  expiresInSeconds?: number
  contentType?: string
}

// ── Provider interface ──────────────────────────────

export interface StorageProvider {
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

// ── Config ──────────────────────────────────────────

export interface LocalStorageConfig {
  provider: "local"
  basePath: string
  baseUrl: string
}

export interface S3StorageConfig {
  provider: "s3"
  bucket: string
  region: string
  endpoint?: string
  accessKeyId: string
  secretAccessKey: string
  baseUrl?: string
}

export type StorageConfig = LocalStorageConfig | S3StorageConfig
