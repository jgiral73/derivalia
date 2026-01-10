import { ConsentDecision } from './ConsentDecision';
import { InvalidConsentDecisionError } from '../errors';

describe('ConsentDecision', () => {
  it('parses allow decision', () => {
    const decision = ConsentDecision.fromValue('allow');

    expect(decision.value).toBe('allow');
  });

  it('rejects invalid decision', () => {
    expect(() => ConsentDecision.fromValue('invalid')).toThrow(
      InvalidConsentDecisionError,
    );
  });
});
