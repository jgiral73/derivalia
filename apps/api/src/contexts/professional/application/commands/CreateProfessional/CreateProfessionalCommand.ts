export class CreateProfessionalCommand {
  constructor(
    public readonly userId: string,
    public readonly email?: string,
  ) {}
}
