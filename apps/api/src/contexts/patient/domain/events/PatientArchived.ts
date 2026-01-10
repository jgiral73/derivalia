import { DomainEvent } from 'src/shared';

export class PatientArchived implements DomainEvent {
  readonly eventName = 'PatientArchived';
  readonly occurredOn: Date;

  constructor(public readonly aggregateId: string) {
    this.occurredOn = new Date();
  }
}
