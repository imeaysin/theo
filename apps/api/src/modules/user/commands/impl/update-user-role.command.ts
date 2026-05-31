export class UpdateUserRoleCommand {
  constructor(
    public readonly userId: string,
    public readonly role: 'admin' | 'user',
  ) {}
}
