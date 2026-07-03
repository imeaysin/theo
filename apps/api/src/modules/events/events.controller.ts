import { Controller, Inject, MessageEvent, Sse } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import type { JwtClaims } from "@workspace/auth/types"
import type { EventBus } from "@workspace/realtime"
import { Observable } from "rxjs"
import { CurrentUser } from "../../common/decorators"
import { ApiAuthErrorResponses } from "../../common/decorators/api-error-responses.decorator"
import { EVENT_BUS } from "../../common/realtime/realtime.module"

@ApiTags("events")
@ApiAuthErrorResponses()
@Controller({ path: "events", version: "1" })
export class EventsController {
  constructor(@Inject(EVENT_BUS) private readonly eventBus: EventBus) {}

  @Sse("stream")
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "SSE event stream",
    description:
      "Server-Sent Events stream scoped to the authenticated user. " +
      "Emits real-time events such as new notifications, unread-count changes, etc.",
  })
  stream(@CurrentUser() user: JwtClaims): Observable<MessageEvent> {
    const channel = `user:${user.id}`

    return new Observable((subscriber) => {
      let unsubscribe: (() => void) | undefined

      this.eventBus
        .subscribe(channel, (payload) => {
          subscriber.next({ data: payload } as MessageEvent)
        })
        .then((unsub) => {
          unsubscribe = unsub
        })

      return () => {
        unsubscribe?.()
      }
    })
  }
}
