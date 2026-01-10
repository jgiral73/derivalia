import { InvalidProfessionalIdError } from '../errors';

export class ProfessionalId {
  private constructor(public readonly value: string) {}

  static fromString(value: string): ProfessionalId {
    const normalized = value.trim();
    if (!normalized) {
      throw new InvalidProfessionalIdError();
    }
    return new ProfessionalId(normalized);
  }
}
