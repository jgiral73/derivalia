import { InvalidOrganizationTypeError } from '../errors';

export type OrganizationTypeValue =
  | 'clinic'
  | 'center'
  | 'private_practice';

export class OrganizationType {
  static Clinic = new OrganizationType('clinic');
  static Center = new OrganizationType('center');
  static PrivatePractice = new OrganizationType('private_practice');

  private constructor(public readonly value: OrganizationTypeValue) {}

  static fromValue(value: string): OrganizationType {
    switch (value) {
      case 'clinic':
        return OrganizationType.Clinic;
      case 'center':
        return OrganizationType.Center;
      case 'private_practice':
        return OrganizationType.PrivatePractice;
      default:
        throw new InvalidOrganizationTypeError(value);
    }
  }
}
