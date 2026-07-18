import { Global, Module } from "@nestjs/common"
import { env } from "@workspace/config"
import { resolveStorageLocalPath, storageEnv } from "@workspace/config/storage"
import { createStorage, type StorageProvider } from "@workspace/storage"

export const STORAGE = Symbol("STORAGE")

export function resolveLocalSigningSecret(): string {
  return storageEnv.STORAGE_SIGNING_SECRET || env.BETTER_AUTH_SECRET
}

export function createLocalStorageConfig() {
  return {
    provider: "local" as const,
    basePath: resolveStorageLocalPath(),
    baseUrl: storageEnv.STORAGE_LOCAL_URL,
    signingSecret: resolveLocalSigningSecret(),
  }
}

function createStorageProvider(): StorageProvider {
  if (storageEnv.STORAGE_PROVIDER === "s3") {
    return createStorage({
      provider: "s3",
      bucket: storageEnv.STORAGE_S3_BUCKET,
      region: storageEnv.STORAGE_S3_REGION,
      endpoint: storageEnv.STORAGE_S3_ENDPOINT,
      accessKeyId: storageEnv.STORAGE_S3_ACCESS_KEY_ID,
      secretAccessKey: storageEnv.STORAGE_S3_SECRET_ACCESS_KEY,
      baseUrl: storageEnv.STORAGE_S3_BASE_URL,
    })
  }

  return createStorage(createLocalStorageConfig())
}

@Global()
@Module({
  providers: [{ provide: STORAGE, useFactory: createStorageProvider }],
  exports: [STORAGE],
})
export class StorageModule {}
