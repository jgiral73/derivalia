export class RejectConformityCommand {
  constructor(
    public readonly consentId: string,
    public readonly conformityId: string,
  ) {}
}
