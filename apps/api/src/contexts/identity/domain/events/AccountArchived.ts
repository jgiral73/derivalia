import { DomainEvent } from './DomainEvent';

export class AccountArchived implements DomainEvent {
  readonly eventName = 'AccountArchived';
  readonly occurredOn: Date;

  constructor(public readonly aggregateId: string) {
    this.occurredOn = new Date();
  }
}
