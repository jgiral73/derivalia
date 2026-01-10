import { ConformityStatus } from './ConformityStatus';
import { InvalidConformityStatusError } from '../errors';

describe('ConformityStatus', () => {
  it('parses requested status', () => {
    const status = ConformityStatus.fromValue('requested');

    expect(status.value).toBe('requested');
  });

  it('rejects invalid status', () => {
    expect(() => ConformityStatus.fromValue('invalid')).toThrow(
      InvalidConformityStatusError,
    );
  });
});
