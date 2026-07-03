import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger"
import type { JwtClaims } from "@workspace/auth/types"
import { CurrentUser } from "../../common/decorators"
import { ApiAuthErrorResponses } from "../../common/decorators/api-error-responses.decorator"
import { DeleteNotificationCommand } from "./commands/delete-notification/delete-notification.command"
import { MarkAllNotificationsReadCommand } from "./commands/mark-all-notifications-read/mark-all-notifications-read.command"
import { MarkNotificationReadCommand } from "./commands/mark-notification-read/mark-notification-read.command"
import { RegisterDeviceTokenCommand } from "./commands/register-device-token/register-device-token.command"
import { UnregisterDeviceTokenCommand } from "./commands/unregister-device-token/unregister-device-token.command"
import {
  NotificationListApiResponseDto,
  RegisterDeviceTokenDto,
  UnreadCountApiResponseDto,
  UnregisterDeviceTokenDto,
} from "./notifications.dto"
import { CountUnreadNotificationsQuery } from "./queries/count-unread-notifications/count-unread-notifications.query"
import { ListNotificationsQuery } from "./queries/list-notifications/list-notifications.query"

@ApiTags("notifications")
@ApiAuthErrorResponses()
@Controller({ path: "notifications", version: "1" })
export class NotificationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  // -----------------------------------------------------------------------
  // In-app notifications
  // -----------------------------------------------------------------------

  @Get()
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "List notifications",
    description:
      "Returns recent in-app notifications for the authenticated user.",
  })
  @ApiOkResponse({ type: NotificationListApiResponseDto })
  list(@CurrentUser() user: JwtClaims) {
    return this.queryBus.execute(new ListNotificationsQuery(user.id))
  }

  @Get("unread-count")
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Get unread count",
    description: "Returns the count of unread notifications.",
  })
  @ApiOkResponse({ type: UnreadCountApiResponseDto })
  unreadCount(@CurrentUser() user: JwtClaims) {
    return this.queryBus.execute(new CountUnreadNotificationsQuery(user.id))
  }

  @Post(":id/read")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Mark as read",
    description: "Marks a single notification as read.",
  })
  @ApiParam({
    name: "id",
    description: "Notification id",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiNoContentResponse({ description: "Marked as read" })
  markRead(@CurrentUser() user: JwtClaims, @Param("id") id: string) {
    return this.commandBus.execute(new MarkNotificationReadCommand(user.id, id))
  }

  @Post("read-all")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Mark all as read",
    description: "Marks all unread notifications as read for the user.",
  })
  @ApiNoContentResponse({ description: "All marked as read" })
  markAllRead(@CurrentUser() user: JwtClaims) {
    return this.commandBus.execute(new MarkAllNotificationsReadCommand(user.id))
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Delete a notification",
    description: "Permanently deletes a notification owned by the user.",
  })
  @ApiParam({
    name: "id",
    description: "Notification id",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiNoContentResponse({ description: "Notification deleted" })
  remove(@CurrentUser() user: JwtClaims, @Param("id") id: string) {
    return this.commandBus.execute(new DeleteNotificationCommand(user.id, id))
  }

  // -----------------------------------------------------------------------
  // Device tokens
  // -----------------------------------------------------------------------

  @Post("device-tokens")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Register device token",
    description:
      "Registers an Expo push token for the authenticated user. " +
      "Upserts — if the token already exists it is reassigned to this user.",
  })
  @ApiNoContentResponse({ description: "Token registered" })
  registerToken(
    @CurrentUser() user: JwtClaims,
    @Body() body: RegisterDeviceTokenDto
  ) {
    return this.commandBus.execute(
      new RegisterDeviceTokenCommand(user.id, body)
    )
  }

  @Post("device-tokens/unregister")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Unregister device token",
    description: "Removes a previously registered push token.",
  })
  @ApiNoContentResponse({ description: "Token removed" })
  unregisterToken(
    @CurrentUser() user: JwtClaims,
    @Body() body: UnregisterDeviceTokenDto
  ) {
    return this.commandBus.execute(
      new UnregisterDeviceTokenCommand(user.id, body.token)
    )
  }
}
