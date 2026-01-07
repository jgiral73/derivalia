import { DomainEvent } from './DomainEvent';

export class RoleAssigned implements DomainEvent {
  readonly eventName = 'RoleAssigned';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly roleId: string,
    public readonly roleName: string,
  ) {
    this.occurredOn = new Date();
  }
}
