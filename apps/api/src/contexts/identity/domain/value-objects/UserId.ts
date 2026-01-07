import { InvalidUserIdError } from '../errors/DomainErrors';

export class UserId {
  private constructor(public readonly value: string) {}

  static fromString(value: string): UserId {
    if (!value || value.trim().length === 0) {
      throw new InvalidUserIdError();
    }
    return new UserId(value);
  }
}
