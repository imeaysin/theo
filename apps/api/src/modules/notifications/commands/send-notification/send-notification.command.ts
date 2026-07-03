import type { SendNotificationInput } from "@workspace/contracts"

export class SendNotificationCommand {
  constructor(public readonly input: SendNotificationInput) {}
}
