export class RegisterPatientUserCommand {
  constructor(
    public readonly patientId: string,
    public readonly userId: string,
  ) {}
}
