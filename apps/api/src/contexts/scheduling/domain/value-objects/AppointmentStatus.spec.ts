import { AppointmentStatus } from './AppointmentStatus';
import { AppointmentStateTransitionNotAllowedError } from '../errors';

describe('AppointmentStatus', () => {
  it('allows scheduled to cancelled', () => {
    const next = AppointmentStatus.Scheduled.transitionTo(
      AppointmentStatus.Cancelled,
    );

    expect(next.value).toBe('cancelled');
  });

  it('rejects cancelled to scheduled', () => {
    expect(() =>
      AppointmentStatus.Cancelled.transitionTo(AppointmentStatus.Scheduled),
    ).toThrow(AppointmentStateTransitionNotAllowedError);
  });
});
