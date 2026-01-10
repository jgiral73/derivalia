import { InvalidOrganizationIdError } from '../errors';

export class OrganizationId {
  private constructor(public readonly value: string) {}

  static fromString(value: string): OrganizationId {
    const normalized = value.trim();
    if (!normalized) {
      throw new InvalidOrganizationIdError();
    }
    return new OrganizationId(normalized);
  }
}
