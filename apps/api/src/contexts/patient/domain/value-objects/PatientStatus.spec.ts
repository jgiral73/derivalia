import { PatientStatus } from '.';
import { PatientStateTransitionNotAllowedError } from '../errors';

describe('PatientStatus', () => {
  it('allows valid transitions', () => {
    const next = PatientStatus.CreatedByProfessional.transitionTo(
      PatientStatus.Invited,
    );

    expect(next.value).toBe('invited');
  });

  it('rejects invalid transitions', () => {
    expect(() =>
      PatientStatus.Active.transitionTo(PatientStatus.Invited),
    ).toThrow(PatientStateTransitionNotAllowedError);
  });
});
