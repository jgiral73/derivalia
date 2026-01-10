import { InvalidPatientIdError } from '../errors';

export class PatientId {
  private constructor(public readonly value: string) {}

  static fromString(value: string): PatientId {
    if (!value || value.trim().length === 0) {
      throw new InvalidPatientIdError();
    }

    return new PatientId(value.trim());
  }
}
