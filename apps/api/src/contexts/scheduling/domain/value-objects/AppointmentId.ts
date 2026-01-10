import { InvalidAppointmentIdError } from '../errors';

export class AppointmentId {
  private constructor(public readonly value: string) {}

  static fromString(value: string): AppointmentId {
    const normalized = value.trim();
    if (!normalized) {
      throw new InvalidAppointmentIdError();
    }
    return new AppointmentId(normalized);
  }
}
