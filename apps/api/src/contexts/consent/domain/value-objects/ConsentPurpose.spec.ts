import { ConsentPurpose } from './ConsentPurpose';
import { InvalidConsentPurposeError } from '../errors';

describe('ConsentPurpose', () => {
  it('creates with valid purpose', () => {
    const purpose = ConsentPurpose.create('care');

    expect(purpose.value).toBe('care');
  });

  it('rejects invalid purpose', () => {
    expect(() => ConsentPurpose.create('invalid')).toThrow(
      InvalidConsentPurposeError,
    );
  });
});
