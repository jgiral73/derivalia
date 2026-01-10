import { ConformityType } from './ConformityType';
import { InvalidConformityTypeError } from '../errors';

describe('ConformityType', () => {
  it('creates with valid type', () => {
    const type = ConformityType.create('collaboration');

    expect(type.value).toBe('collaboration');
  });

  it('rejects invalid type', () => {
    expect(() => ConformityType.create('invalid')).toThrow(
      InvalidConformityTypeError,
    );
  });
});
