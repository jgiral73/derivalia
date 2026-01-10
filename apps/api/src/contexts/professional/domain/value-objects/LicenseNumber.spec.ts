import { LicenseNumber } from '.';
import { InvalidLicenseNumberError } from '../errors';

describe('LicenseNumber', () => {
  it('creates normalized license number', () => {
    const license = LicenseNumber.create('abc-123');

    expect(license.value).toBe('ABC-123');
  });

  it('rejects invalid license', () => {
    expect(() => LicenseNumber.create('###')).toThrow(
      InvalidLicenseNumberError,
    );
  });
});
