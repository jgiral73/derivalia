import { InvalidRoleNameError } from '../errors';

export class RoleName {
  private constructor(public readonly value: string) {}

  static create(value: string): RoleName {
    const normalized = value.trim();
    if (!normalized) {
      throw new InvalidRoleNameError(value);
    }
    return new RoleName(normalized);
  }
}
