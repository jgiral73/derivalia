import { DomainEvent } from 'src/shared';

export class CollaborationAccepted implements DomainEvent {
  readonly eventName = 'CollaborationAccepted';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly collaboratorProfessionalId: string,
  ) {
    this.occurredOn = new Date();
  }
}
