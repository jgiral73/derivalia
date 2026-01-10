import {
  InvalidProfessionalStatusError,
  ProfessionalStateTransitionNotAllowedError,
} from '../errors';

export type ProfessionalStatusValue =
  | 'invited'
  | 'partial_onboarding'
  | 'active'
  | 'suspended';

export class ProfessionalStatus {
  static Invited = new ProfessionalStatus('invited');
  static PartialOnboarding = new ProfessionalStatus('partial_onboarding');
  static Active = new ProfessionalStatus('active');
  static Suspended = new ProfessionalStatus('suspended');

  private constructor(public readonly value: ProfessionalStatusValue) {}

  static fromValue(value: string): ProfessionalStatus {
    switch (value) {
      case 'invited':
        return ProfessionalStatus.Invited;
      case 'partial_onboarding':
        return ProfessionalStatus.PartialOnboarding;
      case 'active':
        return ProfessionalStatus.Active;
      case 'suspended':
        return ProfessionalStatus.Suspended;
      default:
        throw new InvalidProfessionalStatusError(value);
    }
  }

  canTransitionTo(next: ProfessionalStatus): boolean {
    const allowed: Record<ProfessionalStatusValue, ProfessionalStatusValue[]> =
      {
        invited: ['partial_onboarding', 'suspended'],
        partial_onboarding: ['active', 'suspended'],
        active: ['suspended'],
        suspended: [],
      };

    return allowed[this.value].includes(next.value);
  }

  transitionTo(next: ProfessionalStatus): ProfessionalStatus {
    if (!this.canTransitionTo(next)) {
      throw new ProfessionalStateTransitionNotAllowedError(
        this.value,
        next.value,
      );
    }

    return next;
  }
}
