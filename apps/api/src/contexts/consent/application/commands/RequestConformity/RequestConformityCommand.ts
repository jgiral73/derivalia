export class RequestConformityCommand {
  constructor(
    public readonly consentId: string,
    public readonly type: string,
  ) {}
}
