import { DomainEvent } from 'src/shared';

export class AccountEnabled implements DomainEvent {
  readonly eventName = 'AccountEnabled';
  readonly occurredOn: Date;

  constructor(public readonly aggregateId: string) {
    this.occurredOn = new Date();
  }
}
