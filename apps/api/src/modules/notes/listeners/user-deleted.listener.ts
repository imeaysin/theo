import { Injectable, Logger } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { NotesService } from "../notes.service"
import { UserDeletedEvent } from "@/modules/users/events/user-deleted.event"
import { AppEvents } from "@/common/events"

@Injectable()
export class UserDeletedListener {
  private readonly logger = new Logger(UserDeletedListener.name)

  constructor(private readonly notesService: NotesService) {}

  @OnEvent(AppEvents.USER_DELETED, { async: true })
  async handleUserDeletedEvent(event: UserDeletedEvent) {
    this.logger.log(
      `Received account teardown signal for user ID: ${event.userId}`
    )

    try {
      await this.notesService.purgeAllNotesForUser(event.userId)
      this.logger.log(
        `Successfully completed cascade notes deletion for user ID: ${event.userId}`
      )
    } catch (error) {
      const err = error as Error
      this.logger.error(
        `Critical: Failed cascade purge of notes for user ${event.userId}. Root cause: ${err.message}`,
        err.stack
      )
    }
  }
}
