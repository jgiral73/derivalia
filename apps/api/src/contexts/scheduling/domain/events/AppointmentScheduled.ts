import { DomainEvent } from 'src/shared';

export class AppointmentScheduled implements DomainEvent {
  readonly eventName = 'AppointmentScheduled';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly professionalId: string,
  ) {
    this.occurredOn = new Date();
  }
}
