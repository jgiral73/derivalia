export class RequestConsentRequestDto {
  patientId!: string;
  granteeId!: string;
  scopeType!: string;
  scopeRef!: string;
  purpose!: string;
  validUntil?: string;
}
