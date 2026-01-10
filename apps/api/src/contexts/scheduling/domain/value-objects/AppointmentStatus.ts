import { AppointmentStateTransitionNotAllowedError } from '../errors';

export type AppointmentStatusValue = 'scheduled' | 'cancelled' | 'rescheduled';

export class AppointmentStatus {
  static Scheduled = new AppointmentStatus('scheduled');
  static Cancelled = new AppointmentStatus('cancelled');
  static Rescheduled = new AppointmentStatus('rescheduled');

  private constructor(public readonly value: AppointmentStatusValue) {}

  static fromValue(value: string): AppointmentStatus {
    switch (value) {
      case 'scheduled':
        return AppointmentStatus.Scheduled;
      case 'cancelled':
        return AppointmentStatus.Cancelled;
      case 'rescheduled':
        return AppointmentStatus.Rescheduled;
      default:
        return AppointmentStatus.Scheduled;
    }
  }

  canTransitionTo(next: AppointmentStatus): boolean {
    const allowed: Record<AppointmentStatusValue, AppointmentStatusValue[]> = {
      scheduled: ['cancelled', 'rescheduled'],
      cancelled: [],
      rescheduled: [],
    };

    return allowed[this.value].includes(next.value);
  }

  transitionTo(next: AppointmentStatus): AppointmentStatus {
    if (!this.canTransitionTo(next)) {
      throw new AppointmentStateTransitionNotAllowedError(
        this.value,
        next.value,
      );
    }
    return next;
  }
}
