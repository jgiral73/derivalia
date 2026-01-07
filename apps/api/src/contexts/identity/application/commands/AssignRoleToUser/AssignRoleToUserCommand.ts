export class AssignRoleToUserCommand {
  constructor(
    public readonly userId: string,
    public readonly roleName: string,
  ) {}
}
