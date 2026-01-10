export class GrantConsentCommand {
  constructor(
    public readonly consentId: string,
    public readonly validUntil?: Date | null,
  ) {}
}
