export class UpdateProfessionalProfileCommand {
  constructor(
    public readonly professionalId: string,
    public readonly fullName?: string,
    public readonly licenseNumber?: string,
    public readonly specialties?: string[],
  ) {}
}
