import { DomainEvent } from './DomainEvent';

export class AccountDisabled implements DomainEvent {
  readonly eventName = 'AccountDisabled';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly reason?: string,
  ) {
    this.occurredOn = new Date();
  }
}
