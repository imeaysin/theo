import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
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
  S3StorageConfig,
} from "../types"
import { StorageError } from "../types"

export class S3StorageProvider implements StorageProvider {
  private readonly client: S3Client
  private readonly bucket: string
  private readonly region: string
  private readonly baseUrl: string | undefined

  constructor(config: S3StorageConfig) {
    this.client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: config.endpoint ? true : undefined,
    })
    this.bucket = config.bucket
    this.region = config.region
    this.baseUrl = config.baseUrl
  }

  async upload(input: StorageUploadInput): Promise<StorageUploadResult> {
    try {
      const { ETag } = await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: input.path,
          Body: input.body,
          ContentType: input.contentType,
          ContentLength: input.contentLength,
          CacheControl: input.cacheControl,
          Metadata: input.metadata,
        })
      )

      return {
        path: input.path,
        url: this.getUrl(input.path),
        etag: ETag,
        contentLength: input.contentLength,
      }
    } catch (cause) {
      throw new StorageError(
        `Upload failed: ${input.path}`,
        "UPLOAD_FAILED",
        cause
      )
    }
  }

  async delete(input: StorageDeleteInput): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: input.path,
        })
      )
    } catch (cause) {
      throw new StorageError(
        `Delete failed: ${input.path}`,
        "DELETE_FAILED",
        cause
      )
    }
  }

  getUrl(path: string): string {
    if (this.baseUrl) {
      return `${this.baseUrl.replace(/\/+$/, "")}/${path}`
    }

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${path}`
  }

  async exists(path: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: path,
        })
      )
      return true
    } catch (cause) {
      const err = cause as { name?: string }
      if (err.name === "NotFound") return false
      throw new StorageError(
        `Exists check failed: ${path}`,
        "PROVIDER_ERROR",
        cause
      )
    }
  }

  async copy(input: StorageCopyInput): Promise<StorageCopyResult> {
    try {
      await this.client.send(
        new CopyObjectCommand({
          Bucket: this.bucket,
          Key: input.destinationPath,
          CopySource: `/${this.bucket}/${input.sourcePath}`,
        })
      )

      return {
        path: input.destinationPath,
        url: this.getUrl(input.destinationPath),
      }
    } catch (cause) {
      throw new StorageError(
        `Copy failed: ${input.sourcePath} -> ${input.destinationPath}`,
        "COPY_FAILED",
        cause
      )
    }
  }

  async move(input: StorageMoveInput): Promise<StorageMoveResult> {
    await this.copy({
      sourcePath: input.sourcePath,
      destinationPath: input.destinationPath,
    })

    await this.delete({ path: input.sourcePath })

    return {
      path: input.destinationPath,
      url: this.getUrl(input.destinationPath),
    }
  }

  async list(input?: StorageListInput): Promise<StorageListResult> {
    try {
      const response = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: input?.prefix,
          Delimiter: input?.delimiter,
          MaxKeys: input?.maxKeys,
        })
      )

      const files: StorageListEntry[] = (response.Contents ?? [])
        .filter((obj) => obj.Key)
        .map((obj) => ({
          path: obj.Key!,
          size: obj.Size ?? 0,
          lastModified: obj.LastModified ?? new Date(0),
          etag: obj.ETag,
        }))

      const prefixes: string[] = (response.CommonPrefixes ?? [])
        .filter((cp) => cp.Prefix)
        .map((cp) => cp.Prefix!)

      return {
        files,
        prefixes,
        isTruncated: response.IsTruncated ?? false,
      }
    } catch (cause) {
      throw new StorageError(
        `List failed: ${input?.prefix || "/"}`,
        "LIST_FAILED",
        cause
      )
    }
  }

  async metadata(path: string): Promise<StorageFileMetadata | null> {
    try {
      const response = await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: path,
        })
      )

      return {
        size: response.ContentLength ?? 0,
        contentType: response.ContentType ?? "application/octet-stream",
        lastModified: response.LastModified ?? new Date(0),
        etag: response.ETag,
        metadata: response.Metadata,
      }
    } catch (cause) {
      const err = cause as { name?: string }
      if (err.name === "NotFound") return null
      throw new StorageError(
        `Metadata retrieval failed: ${path}`,
        "PROVIDER_ERROR",
        cause
      )
    }
  }

  async getSignedDownloadUrl(
    path: string,
    options?: SignedUrlOptions
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: path,
        ResponseContentType: options?.contentType,
      })

      return getSignedUrl(this.client, command, {
        expiresIn: options?.expiresInSeconds ?? 3600,
      })
    } catch (cause) {
      throw new StorageError(
        `Signed download URL generation failed: ${path}`,
        "PROVIDER_ERROR",
        cause
      )
    }
  }

  async getSignedUploadUrl(
    path: string,
    options?: SignedUrlOptions
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: path,
        ContentType: options?.contentType,
      })

      return getSignedUrl(this.client, command, {
        expiresIn: options?.expiresInSeconds ?? 3600,
      })
    } catch (cause) {
      throw new StorageError(
        `Signed upload URL generation failed: ${path}`,
        "PROVIDER_ERROR",
        cause
      )
    }
  }
}
