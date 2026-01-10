import { InvalidConformityTypeError } from '../errors';

export type ConformityTypeValue =
  | 'collaboration'
  | 'treatment'
  | 'data_sharing';

export class ConformityType {
  private constructor(public readonly value: ConformityTypeValue) {}

  static create(value: string): ConformityType {
    switch (value) {
      case 'collaboration':
      case 'treatment':
      case 'data_sharing':
        return new ConformityType(value);
      default:
        throw new InvalidConformityTypeError(value);
    }
  }
}
