export class BanUserCommand {
  constructor(
    public readonly userId: string,
    public readonly reason?: string,
  ) {}
}
