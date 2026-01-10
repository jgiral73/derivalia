import { InvalidPatientNameError } from '../errors';

export class PatientName {
  private constructor(public readonly value: string) {}

  static create(value: string): PatientName {
    const normalized = value.trim();

    if (!normalized || normalized.length < 2) {
      throw new InvalidPatientNameError(value);
    }

    return new PatientName(normalized);
  }
}
