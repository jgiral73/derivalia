import { SlotType } from './SlotType';
import { SlotTypeNotAllowedError } from '../errors';

describe('SlotType', () => {
  it('parses availability type', () => {
    const type = SlotType.fromValue('availability');

    expect(type.value).toBe('availability');
  });

  it('rejects invalid type', () => {
    expect(() => SlotType.fromValue('invalid')).toThrow(
      SlotTypeNotAllowedError,
    );
  });
});
