import { DomainEvent } from 'src/shared';

export class AppointmentCancelled implements DomainEvent {
  readonly eventName = 'AppointmentCancelled';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly professionalId: string,
  ) {
    this.occurredOn = new Date();
  }
}
