import { DomainEvent } from 'src/shared';

export class CollaborationRejected implements DomainEvent {
  readonly eventName = 'CollaborationRejected';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly collaboratorProfessionalId: string,
  ) {
    this.occurredOn = new Date();
  }
}
