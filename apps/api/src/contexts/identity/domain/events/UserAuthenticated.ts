import { DomainEvent } from './DomainEvent';

export class UserAuthenticated implements DomainEvent {
  readonly eventName = 'UserAuthenticated';
  readonly occurredOn: Date;

  constructor(public readonly aggregateId: string) {
    this.occurredOn = new Date();
  }
}
