import { Role } from '../entities';
import { RoleName } from '../value-objects';

export interface RoleRepository {
  findByName(name: RoleName): Promise<Role | null>;
  findById(id: string): Promise<Role | null>;
}
