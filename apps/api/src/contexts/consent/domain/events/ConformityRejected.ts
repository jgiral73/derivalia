import { DomainEvent } from 'src/shared';

export class ConformityRejected implements DomainEvent {
  readonly eventName = 'ConformityRejected';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly conformityId: string,
  ) {
    this.occurredOn = new Date();
  }
}
