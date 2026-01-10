import { DomainEvent } from 'src/shared';

export class ConsentRequested implements DomainEvent {
  readonly eventName = 'ConsentRequested';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly patientId: string,
    public readonly granteeId: string,
  ) {
    this.occurredOn = new Date();
  }
}
