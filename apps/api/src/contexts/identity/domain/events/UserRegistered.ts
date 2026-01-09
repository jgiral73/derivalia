import { DomainEvent } from 'src/shared';

export class UserRegistered implements DomainEvent {
  readonly eventName = 'UserRegistered';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly email: string,
  ) {
    this.occurredOn = new Date();
  }
}
