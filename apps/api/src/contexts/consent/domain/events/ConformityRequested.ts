import { DomainEvent } from 'src/shared';

export class ConformityRequested implements DomainEvent {
  readonly eventName = 'ConformityRequested';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly conformityId: string,
    public readonly conformityType: string,
  ) {
    this.occurredOn = new Date();
  }
}
