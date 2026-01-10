import { DomainEvent } from 'src/shared';

export class AppointmentRescheduled implements DomainEvent {
  readonly eventName = 'AppointmentRescheduled';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly professionalId: string,
    public readonly newAppointmentId: string,
  ) {
    this.occurredOn = new Date();
  }
}
