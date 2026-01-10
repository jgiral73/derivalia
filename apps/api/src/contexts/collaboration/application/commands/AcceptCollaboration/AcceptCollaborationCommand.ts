export class AcceptCollaborationCommand {
  constructor(
    public readonly collaborationId: string,
    public readonly collaboratorProfessionalId: string,
  ) {}
}
