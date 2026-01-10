import { ConsentScope } from './ConsentScope';
import { InvalidConsentScopeError } from '../errors';

describe('ConsentScope', () => {
  it('creates with valid type and ref', () => {
    const scope = ConsentScope.create('patient', 'patient-1');

    expect(scope.type).toBe('patient');
    expect(scope.ref).toBe('patient-1');
  });

  it('rejects invalid type', () => {
    expect(() => ConsentScope.create('invalid', 'patient-1')).toThrow(
      InvalidConsentScopeError,
    );
  });

  it('rejects empty ref', () => {
    expect(() => ConsentScope.create('patient', '  ')).toThrow(
      InvalidConsentScopeError,
    );
  });
});
