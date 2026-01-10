import { DomainEvent } from 'src/shared';

export class CollaborationEnded implements DomainEvent {
  readonly eventName = 'CollaborationEnded';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly endedByProfessionalId: string | null,
  ) {
    this.occurredOn = new Date();
  }
}
