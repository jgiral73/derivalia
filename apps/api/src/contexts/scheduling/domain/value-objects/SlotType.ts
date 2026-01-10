import { SlotTypeNotAllowedError } from '../errors';

export type SlotTypeValue = 'availability' | 'external_block';

export class SlotType {
  static Availability = new SlotType('availability');
  static ExternalBlock = new SlotType('external_block');

  private constructor(public readonly value: SlotTypeValue) {}

  static fromValue(value: string): SlotType {
    switch (value) {
      case 'availability':
        return SlotType.Availability;
      case 'external_block':
        return SlotType.ExternalBlock;
      default:
        throw new SlotTypeNotAllowedError(value);
    }
  }
}
