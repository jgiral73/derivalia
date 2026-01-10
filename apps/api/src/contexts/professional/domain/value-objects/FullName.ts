import { InvalidFullNameError } from '../errors';

export class FullName {
  private constructor(public readonly value: string) {}

  static create(value: string): FullName {
    const normalized = value.trim();
    if (normalized.length < 3) {
      throw new InvalidFullNameError(value);
    }
    return new FullName(normalized);
  }
}
