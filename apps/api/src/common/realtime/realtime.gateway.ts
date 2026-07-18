import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets"
import { Inject, UsePipes } from "@nestjs/common"
import type { IncomingHttpHeaders } from "node:http"
import { Server, Socket } from "socket.io"
import { AuthService } from "@workspace/auth/nestjs"
import { env } from "@workspace/config"
import { createLogger } from "@workspace/logger"
import { ZodValidationPipe } from "nestjs-zod"
import { z } from "zod"
import { createZodDto } from "nestjs-zod/dto"

function fromNodeHeaders(nodeHeaders: IncomingHttpHeaders): Headers {
  const webHeaders = new Headers()
  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const entry of value) {
        webHeaders.append(key, entry)
      }
    } else {
      webHeaders.set(key, value)
    }
  }
  return webHeaders
}

const PingPayloadSchema = z.object({
  message: z.string().min(1),
  timestamp: z.string().datetime(),
})

class PingPayloadDto extends createZodDto(PingPayloadSchema) {}

type SocketUserData = {
  userId?: string
}

const corsOrigins = env.ALLOWED_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

@WebSocketGateway({
  cors: {
    origin: corsOrigins,
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server

  private readonly logger = createLogger("RealtimeGateway")

  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const session = await this.authService.api.getSession({
        headers: fromNodeHeaders(client.handshake.headers),
      })

      if (!session?.user?.id) {
        this.logger.info(
          { clientId: client.id },
          "websocket connection rejected — no session"
        )
        client.disconnect(true)
        return
      }

      const userId = session.user.id
      const data = client.data as SocketUserData
      data.userId = userId
      await client.join(`user:${userId}`)

      this.logger.info(
        { clientId: client.id, userId },
        "Client connected to websocket"
      )
    } catch (err) {
      this.logger.warn(
        { err, clientId: client.id },
        "websocket connection rejected — session lookup failed"
      )
      client.disconnect(true)
    }
  }

  handleDisconnect(client: Socket) {
    const data = client.data as SocketUserData
    this.logger.info(
      { clientId: client.id, userId: data.userId },
      "Client disconnected from websocket"
    )
  }

  @UsePipes(new ZodValidationPipe())
  @SubscribeMessage("ping")
  handlePing(
    @MessageBody() data: PingPayloadDto,
    @ConnectedSocket() client: Socket
  ): { event: string; data: { response: string } } {
    this.logger.debug(
      { clientId: client.id, payload: data },
      "Received ping event"
    )

    return {
      event: "pong",
      data: {
        response: `Received: ${data.message} at ${new Date().toISOString()}`,
      },
    }
  }

  emitToUser<T>(userId: string, event: string, payload: T): void {
    this.server.to(`user:${userId}`).emit(event, payload)
  }
}
