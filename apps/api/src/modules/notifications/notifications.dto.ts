import {
  NotificationApiResponseSchema,
  NotificationListApiResponseSchema,
  RegisterDeviceTokenSchema,
  SendNotificationApiResponseSchema,
  SendNotificationSchema,
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

export class SendNotificationDto extends createZodDto(SendNotificationSchema) {}

export class NotificationApiResponseDto extends createZodDto(
  NotificationApiResponseSchema
) {}

export class NotificationListApiResponseDto extends createZodDto(
  NotificationListApiResponseSchema
) {}

export class UnreadCountApiResponseDto extends createZodDto(
  UnreadCountApiResponseSchema
) {}

export class SendNotificationApiResponseDto extends createZodDto(
  SendNotificationApiResponseSchema
) {}
