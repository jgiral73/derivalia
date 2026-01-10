import { InvalidConsentPurposeError } from '../errors';

export type ConsentPurposeValue = 'care' | 'billing' | 'research' | 'legal';

export class ConsentPurpose {
  private constructor(public readonly value: ConsentPurposeValue) {}

  static create(value: string): ConsentPurpose {
    switch (value) {
      case 'care':
      case 'billing':
      case 'research':
      case 'legal':
        return new ConsentPurpose(value);
      default:
        throw new InvalidConsentPurposeError(value);
    }
  }
}
