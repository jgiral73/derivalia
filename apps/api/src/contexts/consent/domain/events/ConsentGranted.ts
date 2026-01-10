import { DomainEvent } from 'src/shared';

export class ConsentGranted implements DomainEvent {
  readonly eventName = 'ConsentGranted';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly patientId: string,
    public readonly granteeId: string,
  ) {
    this.occurredOn = new Date();
  }
}
