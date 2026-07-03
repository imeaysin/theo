import type { CreateNoteInput } from "@workspace/contracts"
import type { NewNoteEntity } from "../entities/note.entity"
import type { NoteActorScope } from "../note.scope"

export class CreateNoteCommand {
  constructor(
    public readonly organizationId: string,
    public readonly userId: string,
    public readonly input: CreateNoteInput
  ) {}

  get scope(): NoteActorScope {
    return {
      organizationId: this.organizationId,
      userId: this.userId,
    }
  }

  get entity(): NewNoteEntity {
    return {
      organizationId: this.organizationId,
      userId: this.userId,
      title: this.input.title,
      body: this.input.body ?? "",
    }
  }
}
