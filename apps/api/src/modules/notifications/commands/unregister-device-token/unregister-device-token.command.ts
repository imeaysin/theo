export class UnregisterDeviceTokenCommand {
  constructor(
    public readonly userId: string,
    public readonly token: string
  ) {}
}
