import { InvalidSpecialtyError } from '../errors';

export class Specialty {
  private constructor(public readonly value: string) {}

  static create(value: string): Specialty {
    const normalized = value.trim();
    if (!normalized) {
      throw new InvalidSpecialtyError(value);
    }
    return new Specialty(normalized.toLowerCase());
  }
}
