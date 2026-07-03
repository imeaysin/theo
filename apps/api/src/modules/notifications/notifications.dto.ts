import {
  NotificationListApiResponseSchema,
  RegisterDeviceTokenSchema,
  UnreadCountApiResponseSchema,
  UnregisterDeviceTokenSchema,
} from "@workspace/contracts"
import { createZodDto } from "nestjs-zod"

export class RegisterDeviceTokenDto extends createZodDto(
  RegisterDeviceTokenSchema
) {}

export class UnregisterDeviceTokenDto extends createZodDto(
  UnregisterDeviceTokenSchema
) {}

export class NotificationListApiResponseDto extends createZodDto(
  NotificationListApiResponseSchema
) {}

export class UnreadCountApiResponseDto extends createZodDto(
  UnreadCountApiResponseSchema
) {}
