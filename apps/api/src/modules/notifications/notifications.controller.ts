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
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger"
import { Session, type UserSession } from "@/common/decorators"
import { ApiAuthErrorResponses } from "@/common/decorators/api-error-responses.decorator"
import { NotificationsService } from "./notifications.service"
import {
  RegisterDeviceTokenDto,
  UnregisterDeviceTokenDto,
  NotificationListApiResponseDto,
  UnreadCountApiResponseDto,
} from "./dto"

@ApiTags("notifications")
@ApiAuthErrorResponses()
@Controller({ path: "notifications", version: "1" })
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "List notifications" })
  @ApiOkResponse({ type: NotificationListApiResponseDto })
  list(@Session() session: UserSession) {
    return this.notificationsService.listNotifications({
      userId: session.user.id,
    })
  }

  @Get("unread-count")
  @ApiOperation({ summary: "Get unread count" })
  @ApiOkResponse({ type: UnreadCountApiResponseDto })
  unreadCount(@Session() session: UserSession) {
    return this.notificationsService.countUnread({ userId: session.user.id })
  }

  @Post(":id/read")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Mark as read" })
  @ApiParam({ name: "id", description: "Notification id" })
  @ApiNoContentResponse({ description: "Marked as read" })
  markRead(@Session() session: UserSession, @Param("id") id: string) {
    return this.notificationsService.markAsRead({
      userId: session.user.id,
      notificationId: id,
    })
  }

  @Post("read-all")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Mark all as read" })
  @ApiNoContentResponse({ description: "All marked as read" })
  markAllRead(@Session() session: UserSession) {
    return this.notificationsService.markAllAsRead({
      userId: session.user.id,
    })
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a notification" })
  @ApiParam({ name: "id", description: "Notification id" })
  @ApiNoContentResponse({ description: "Notification deleted" })
  remove(@Session() session: UserSession, @Param("id") id: string) {
    return this.notificationsService.deleteNotification({
      userId: session.user.id,
      notificationId: id,
    })
  }

  @Post("device-tokens")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Register device token" })
  @ApiNoContentResponse({ description: "Token registered" })
  registerToken(
    @Session() session: UserSession,
    @Body() body: RegisterDeviceTokenDto
  ) {
    return this.notificationsService.registerDeviceToken({
      userId: session.user.id,
      ...body,
    })
  }

  @Post("device-tokens/unregister")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Unregister device token" })
  @ApiNoContentResponse({ description: "Token removed" })
  unregisterToken(
    @Session() session: UserSession,
    @Body() body: UnregisterDeviceTokenDto
  ) {
    return this.notificationsService.unregisterDeviceToken(
      session.user.id,
      body.token
    )
  }
}
