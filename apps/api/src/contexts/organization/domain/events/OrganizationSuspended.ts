import { DomainEvent } from 'src/shared';

export class OrganizationSuspended implements DomainEvent {
  readonly eventName = 'OrganizationSuspended';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly ownerUserId: string,
  ) {
    this.occurredOn = new Date();
  }
}
