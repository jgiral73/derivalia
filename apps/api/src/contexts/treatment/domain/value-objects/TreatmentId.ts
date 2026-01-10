import { InvalidTreatmentIdError } from '../errors';

export class TreatmentId {
  private constructor(public readonly value: string) {}

  static fromString(value: string): TreatmentId {
    const normalized = value.trim();
    if (!normalized) {
      throw new InvalidTreatmentIdError();
    }
    return new TreatmentId(normalized);
  }
}
