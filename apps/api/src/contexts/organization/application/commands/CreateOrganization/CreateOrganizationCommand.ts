export class CreateOrganizationCommand {
  constructor(
    public readonly ownerUserId: string,
    public readonly name: string,
    public readonly type: string,
  ) {}
}
