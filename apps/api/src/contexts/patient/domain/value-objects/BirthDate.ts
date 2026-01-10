import { InvalidBirthDateError } from '../errors';

export class BirthDate {
  private constructor(public readonly value: Date) {}

  static fromDate(value: Date): BirthDate {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new InvalidBirthDateError();
    }

    const now = new Date();
    if (value.getTime() > now.getTime()) {
      throw new InvalidBirthDateError();
    }

    return new BirthDate(value);
  }
}
