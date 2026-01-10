import { DomainEvent } from 'src/shared';

export class PatientUpdated implements DomainEvent {
  readonly eventName = 'PatientUpdated';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly status: string,
    public readonly userId?: string,
  ) {
    this.occurredOn = new Date();
  }
}
