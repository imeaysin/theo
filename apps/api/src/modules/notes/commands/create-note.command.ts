import type { CreateNoteInput } from "@workspace/contracts"

export class CreateNoteCommand {
  constructor(
    public readonly userId: string,
    public readonly input: CreateNoteInput
  ) {}
}
