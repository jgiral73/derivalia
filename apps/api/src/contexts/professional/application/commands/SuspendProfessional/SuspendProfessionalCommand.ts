export class SuspendProfessionalCommand {
  constructor(
    public readonly professionalId: string,
    public readonly reason?: string,
  ) {}
}
