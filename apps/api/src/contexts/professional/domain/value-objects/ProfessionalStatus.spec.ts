import { ProfessionalStatus } from '.';
import { ProfessionalStateTransitionNotAllowedError } from '../errors';

describe('ProfessionalStatus', () => {
  it('allows valid transitions', () => {
    const next = ProfessionalStatus.Invited.transitionTo(
      ProfessionalStatus.PartialOnboarding,
    );

    expect(next.value).toBe('partial_onboarding');
  });

  it('rejects invalid transitions', () => {
    expect(() =>
      ProfessionalStatus.Active.transitionTo(ProfessionalStatus.Invited),
    ).toThrow(ProfessionalStateTransitionNotAllowedError);
  });
});
