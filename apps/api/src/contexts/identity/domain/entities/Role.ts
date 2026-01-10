import { PermissionSet, RoleName } from '../value-objects';

export class Role {
  constructor(
    public readonly id: string,
    public readonly name: RoleName,
    public readonly permissions: PermissionSet,
  ) {}

  equals(other: Role): boolean {
    return this.id === other.id;
  }
}
