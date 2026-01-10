export class EndCollaborationCommand {
  constructor(
    public readonly collaborationId: string,
    public readonly endedByProfessionalId?: string,
  ) {}
}
