import { InvalidPermissionCodeError } from '../errors';

const PERMISSION_REGEX = /^[a-zA-Z][a-zA-Z0-9_.-]*$/;

export class PermissionCode {
  private constructor(public readonly value: string) {}

  static create(value: string): PermissionCode {
    const normalized = value.trim();
    if (!PERMISSION_REGEX.test(normalized)) {
      throw new InvalidPermissionCodeError(value);
    }
    return new PermissionCode(normalized);
  }
}
