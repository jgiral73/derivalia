import { Role } from '../../domain/entities/Role';
import { RoleRepository } from '../../domain/repositories/RoleRepository';
import { RoleName } from '../../domain/value-objects/RoleName';

export class InMemoryRoleRepository implements RoleRepository {
  private readonly rolesById = new Map<string, Role>();
  private readonly roleIdByName = new Map<string, string>();

  constructor(initialRoles: Role[] = []) {
    initialRoles.forEach((role) => this.add(role));
  }

  add(role: Role): void {
    this.rolesById.set(role.id, role);
    this.roleIdByName.set(role.name.value, role.id);
  }

  async findByName(name: RoleName): Promise<Role | null> {
    const id = this.roleIdByName.get(name.value);
    if (!id) {
      return Promise.resolve(null);
    }

    return Promise.resolve(this.rolesById.get(id) ?? null);
  }

  async findById(id: string): Promise<Role | null> {
    return Promise.resolve(this.rolesById.get(id) ?? null);
  }
}
