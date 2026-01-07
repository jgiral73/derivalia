import { PermissionCode } from './PermissionCode';

export class PermissionSet {
  private readonly permissions: Map<string, PermissionCode>;

  constructor(permissions: PermissionCode[]) {
    this.permissions = new Map(
      permissions.map((permission) => [permission.value, permission]),
    );
  }

  has(permission: PermissionCode): boolean {
    return this.permissions.has(permission.value);
  }

  values(): PermissionCode[] {
    return Array.from(this.permissions.values());
  }
}
