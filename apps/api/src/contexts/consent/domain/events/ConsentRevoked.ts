import { DomainEvent } from 'src/shared';

export class ConsentRevoked implements DomainEvent {
  readonly eventName = 'ConsentRevoked';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly patientId: string,
    public readonly granteeId: string,
  ) {
    this.occurredOn = new Date();
  }
}
