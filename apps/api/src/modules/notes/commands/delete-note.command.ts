export class DeleteNoteCommand {
  constructor(
    public readonly userId: string,
    public readonly noteId: string
  ) {}
}
