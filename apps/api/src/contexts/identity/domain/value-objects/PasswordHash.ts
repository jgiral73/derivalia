import { InvalidPasswordHashError } from '../errors';

export class PasswordHash {
  private constructor(public readonly value: string) {}

  static fromHashed(value: string): PasswordHash {
    if (!value || value.trim().length === 0) {
      throw new InvalidPasswordHashError();
    }
    return new PasswordHash(value);
  }
}
