import { DomainEvent } from 'src/shared';

export class ConformityAccepted implements DomainEvent {
  readonly eventName = 'ConformityAccepted';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly conformityId: string,
  ) {
    this.occurredOn = new Date();
  }
}
