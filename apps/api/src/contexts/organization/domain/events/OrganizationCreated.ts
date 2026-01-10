import { DomainEvent } from 'src/shared';

export class OrganizationCreated implements DomainEvent {
  readonly eventName = 'OrganizationCreated';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly ownerUserId: string,
  ) {
    this.occurredOn = new Date();
  }
}
