import { DomainEvent } from './DomainEvent';
import { ActorType } from '../value-objects/ActorReference';

export class UserLinkedToActor implements DomainEvent {
  readonly eventName = 'UserLinkedToActor';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly actorId: string,
    public readonly actorType: ActorType,
  ) {
    this.occurredOn = new Date();
  }
}
