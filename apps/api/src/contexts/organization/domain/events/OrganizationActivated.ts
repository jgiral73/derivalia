import { DomainEvent } from 'src/shared';

export class OrganizationActivated implements DomainEvent {
  readonly eventName = 'OrganizationActivated';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly ownerUserId: string,
  ) {
    this.occurredOn = new Date();
  }
}
