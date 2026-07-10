import { Body, Controller, Post, Res } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { CoreMessage, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Response } from "express"
import { ApiAuthErrorResponses } from "@/common/decorators/api-error-responses.decorator"
import { RequireOrgPermission } from "@/common/decorators"

@ApiTags("ai")
@ApiAuthErrorResponses()
@Controller({ path: "ai", version: "1" })
export class AiController {
  @Post("chat")
  @RequireOrgPermission("content", "read") // Assume basic permission for now
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Chat with AI",
    description: "Stream a response from the AI assistant.",
  })
  async chat(@Body("messages") messages: CoreMessage[], @Res() res: Response) {
    // Note: In a production app you would validate messages strictly with a DTO (nestjs-zod)
    // but the AI SDK expects a specific shape that might be complex to type perfectly here.
    // For this implementation, we type check within streamText.

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages,
      system: "You are a helpful and intelligent assistant.",
    })

    result.pipeDataStreamToResponse(res)
  }
}
