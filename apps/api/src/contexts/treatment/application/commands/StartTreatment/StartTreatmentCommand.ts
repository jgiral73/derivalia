export class StartTreatmentCommand {
  constructor(
    public readonly patientId: string,
    public readonly professionalId: string,
    public readonly organizationId?: string | null,
    public readonly goal?: string,
  ) {}
}
