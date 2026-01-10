import { InvalidOrganizationNameError } from '../errors';

export class OrganizationName {
  private constructor(public readonly value: string) {}

  static create(value: string): OrganizationName {
    const normalized = value.trim();
    if (normalized.length < 2) {
      throw new InvalidOrganizationNameError(value);
    }
    return new OrganizationName(normalized);
  }
}
