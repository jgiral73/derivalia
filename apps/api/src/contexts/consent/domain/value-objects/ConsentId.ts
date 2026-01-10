import { InvalidConsentIdError } from '../errors';

export class ConsentId {
  private constructor(public readonly value: string) {}

  static fromString(value: string): ConsentId {
    const normalized = value.trim();
    if (!normalized) {
      throw new InvalidConsentIdError();
    }
    return new ConsentId(normalized);
  }
}
