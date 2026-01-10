export class CreatePatientCommand {
  constructor(
    public readonly professionalId: string,
    public readonly fullName: string,
    public readonly birthDate?: string,
    public readonly email?: string,
    public readonly phone?: string,
  ) {}
}
