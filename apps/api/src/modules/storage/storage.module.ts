import { Global, Module } from '@nestjs/common';
import { createStorage } from '@workspace/storage';
import { env } from '@workspace/config';
import type { StorageProvider, StorageConfig } from '@workspace/storage';

export const STORAGE = 'STORAGE';

function buildStorageConfig(): StorageConfig {
  switch (env.STORAGE_PROVIDER) {
    case 'local':
      return {
        provider: 'local',
        basePath: env.STORAGE_LOCAL_PATH,
        baseUrl: env.STORAGE_LOCAL_URL,
      };
    case 's3':
      return {
        provider: 's3',
        bucket: env.STORAGE_S3_BUCKET,
        region: env.STORAGE_S3_REGION,
        endpoint: env.STORAGE_S3_ENDPOINT || undefined,
        accessKeyId: env.STORAGE_S3_ACCESS_KEY_ID,
        secretAccessKey: env.STORAGE_S3_SECRET_ACCESS_KEY,
        baseUrl: env.STORAGE_S3_BASE_URL || undefined,
      };
  }
}

@Global()
@Module({
  providers: [
    {
      provide: STORAGE,
      useFactory: (): StorageProvider => createStorage(buildStorageConfig()),
    },
  ],
  exports: [STORAGE],
})
export class StorageModule {}
