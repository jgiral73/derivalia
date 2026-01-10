export class InvitePatientCommand {
  constructor(
    public readonly patientId: string,
    public readonly email?: string,
    public readonly phone?: string,
  ) {}
}
