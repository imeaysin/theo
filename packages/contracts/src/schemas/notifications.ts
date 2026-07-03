import { z } from "zod"
import { apiSuccessResponse } from "../api/envelopes"

// ---------------------------------------------------------------------------
// Notification (in-app)
// ---------------------------------------------------------------------------

export const NotificationResponseSchema = z
  .object({
    id: z.string().describe("Unique notification identifier"),
    userId: z.string().describe("Recipient user id"),
    title: z.string().describe("Notification title"),
    body: z.string().describe("Notification body"),
    type: z.string().describe("Domain event type (e.g. note-shared)"),
    read: z.boolean().describe("Whether the notification has been read"),
    actionUrl: z
      .string()
      .optional()
      .describe("Deep-link or URL to navigate on tap"),
    createdAt: z.string().describe("ISO-8601 creation timestamp"),
  })
  .meta({
    id: "NotificationResponseDto",
    title: "Notification",
    description: "An in-app notification for a user.",
  })

export const NotificationListResponseSchema = z
  .object({
    items: z.array(NotificationResponseSchema).describe("Notification list"),
    totalUnread: z
      .number()
      .int()
      .nonnegative()
      .describe("Total unread count for the user"),
  })
  .meta({
    id: "NotificationListResponseDto",
    title: "Notification list",
    description: "In-app notifications for the current user.",
  })

export const UnreadCountResponseSchema = z
  .object({
    count: z.number().int().nonnegative().describe("Unread notification count"),
  })
  .meta({
    id: "UnreadCountResponseDto",
    title: "Unread count",
    description: "Count of unread notifications for the current user.",
  })

// ---------------------------------------------------------------------------
// Device tokens
// ---------------------------------------------------------------------------

export const RegisterDeviceTokenSchema = z
  .object({
    token: z
      .string()
      .min(1)
      .meta({
        description: "Expo push token (ExponentPushToken[…])",
        examples: ["ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"],
      }),
    platform: z
      .enum(["ios", "android", "web"])
      .meta({ description: "Device platform" }),
  })
  .strict()
  .meta({
    id: "RegisterDeviceTokenDto",
    title: "Register device token",
    description: "Register an Expo push token for the current user.",
  })

export const UnregisterDeviceTokenSchema = z
  .object({
    token: z
      .string()
      .min(1)
      .meta({
        description: "Expo push token to remove",
        examples: ["ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"],
      }),
  })
  .strict()
  .meta({
    id: "UnregisterDeviceTokenDto",
    title: "Unregister device token",
    description: "Remove a previously registered push token.",
  })

// ---------------------------------------------------------------------------
// Send notification (internal / admin)
// ---------------------------------------------------------------------------

export const SendNotificationSchema = z
  .object({
    userIds: z
      .array(z.string().min(1))
      .min(1)
      .max(1000)
      .meta({
        description: "Target user ids (max 1000 per request)",
        examples: [["user-1", "user-2"]],
      }),
    title: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .meta({
        description: "Notification title",
        examples: ["Alice shared a note with you"],
      }),
    body: z
      .string()
      .max(2000)
      .optional()
      .default("")
      .meta({
        description: "Notification body",
        examples: ["Check out the new design review document."],
      }),
    type: z
      .string()
      .trim()
      .min(1)
      .max(50)
      .meta({
        description: "Domain event type for client routing",
        examples: ["note-shared"],
      }),
    actionUrl: z
      .string()
      .max(2000)
      .optional()
      .meta({
        description: "Deep-link or URL to navigate on tap",
        examples: ["/notes/507f1f77bcf86cd799439011"],
      }),
    data: z
      .record(z.string(), z.unknown())
      .optional()
      .meta({ description: "Arbitrary payload forwarded to the push message" }),
    channels: z
      .array(z.enum(["push", "in-app"]))
      .min(1)
      .default(["push", "in-app"])
      .meta({ description: "Delivery channels" }),
  })
  .strict()
  .meta({
    id: "SendNotificationDto",
    title: "Send notification",
    description: "Send a notification to one or more users.",
  })

export const SendNotificationResponseSchema = z
  .object({
    sent: z.number().int().nonnegative().describe("Notifications created"),
    pushDelivered: z
      .number()
      .int()
      .nonnegative()
      .describe("Push tickets sent successfully"),
    invalidTokensRemoved: z
      .number()
      .int()
      .nonnegative()
      .describe("Stale device tokens cleaned up"),
  })
  .meta({
    id: "SendNotificationResponseDto",
    title: "Send notification result",
    description: "Summary of notification delivery.",
  })

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type NotificationResponse = z.infer<typeof NotificationResponseSchema>
export type NotificationListResponse = z.infer<
  typeof NotificationListResponseSchema
>
export type UnreadCountResponse = z.infer<typeof UnreadCountResponseSchema>
export type RegisterDeviceTokenInput = z.infer<typeof RegisterDeviceTokenSchema>
export type UnregisterDeviceTokenInput = z.infer<
  typeof UnregisterDeviceTokenSchema
>
export type SendNotificationInput = z.infer<typeof SendNotificationSchema>
export type SendNotificationResponse = z.infer<
  typeof SendNotificationResponseSchema
>

// ---------------------------------------------------------------------------
// API envelopes
// ---------------------------------------------------------------------------

export const NotificationApiResponseSchema = apiSuccessResponse(
  NotificationResponseSchema,
  {
    id: "NotificationApiResponseDto",
    title: "Notification response",
    description: "Standard API envelope containing a single notification.",
  }
)

export const NotificationListApiResponseSchema = apiSuccessResponse(
  NotificationListResponseSchema,
  {
    id: "NotificationListApiResponseDto",
    title: "Notification list response",
    description: "Standard API envelope containing the notification list.",
  }
)

export const UnreadCountApiResponseSchema = apiSuccessResponse(
  UnreadCountResponseSchema,
  {
    id: "UnreadCountApiResponseDto",
    title: "Unread count response",
    description: "Standard API envelope containing unread notification count.",
  }
)

export const SendNotificationApiResponseSchema = apiSuccessResponse(
  SendNotificationResponseSchema,
  {
    id: "SendNotificationApiResponseDto",
    title: "Send notification response",
    description: "Standard API envelope containing notification send results.",
  }
)
