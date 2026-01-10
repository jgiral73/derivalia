import { InvalidSlotIdError } from '../errors';

export class SlotId {
  private constructor(public readonly value: string) {}

  static fromString(value: string): SlotId {
    const normalized = value.trim();
    if (!normalized) {
      throw new InvalidSlotIdError();
    }
    return new SlotId(normalized);
  }
}
