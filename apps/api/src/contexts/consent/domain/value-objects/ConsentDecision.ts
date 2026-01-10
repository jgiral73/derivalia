import { InvalidConsentDecisionError } from '../errors';

export type ConsentDecisionValue = 'allow' | 'deny';

export class ConsentDecision {
  static Allow = new ConsentDecision('allow');
  static Deny = new ConsentDecision('deny');

  private constructor(public readonly value: ConsentDecisionValue) {}

  static fromValue(value: string): ConsentDecision {
    switch (value) {
      case 'allow':
        return ConsentDecision.Allow;
      case 'deny':
        return ConsentDecision.Deny;
      default:
        throw new InvalidConsentDecisionError(value);
    }
  }
}
