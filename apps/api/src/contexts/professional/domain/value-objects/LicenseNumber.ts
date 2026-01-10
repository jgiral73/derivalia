import { InvalidLicenseNumberError } from '../errors';

const LICENSE_REGEX = /^[A-Z0-9-]+$/;

export class LicenseNumber {
  private constructor(public readonly value: string) {}

  static create(value: string): LicenseNumber {
    const normalized = value.trim().toUpperCase();
    if (!LICENSE_REGEX.test(normalized)) {
      throw new InvalidLicenseNumberError(value);
    }
    return new LicenseNumber(normalized);
  }
}
