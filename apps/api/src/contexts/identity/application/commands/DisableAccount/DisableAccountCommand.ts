export class DisableAccountCommand {
  constructor(
    public readonly userId: string,
    public readonly reason?: string,
  ) {}
}
