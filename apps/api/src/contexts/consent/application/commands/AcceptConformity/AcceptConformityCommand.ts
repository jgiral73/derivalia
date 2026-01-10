export class AcceptConformityCommand {
  constructor(
    public readonly consentId: string,
    public readonly conformityId: string,
  ) {}
}
