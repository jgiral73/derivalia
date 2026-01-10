export class RequestConsentCommand {
  constructor(
    public readonly patientId: string,
    public readonly granteeId: string,
    public readonly scopeType: string,
    public readonly scopeRef: string,
    public readonly purpose: string,
    public readonly validUntil?: Date | null,
  ) {}
}
