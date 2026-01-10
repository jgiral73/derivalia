export class RejectCollaborationCommand {
  constructor(
    public readonly collaborationId: string,
    public readonly collaboratorProfessionalId: string,
  ) {}
}
