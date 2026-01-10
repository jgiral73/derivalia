import { DomainEvent } from 'src/shared';

export class ProfessionalProfileUpdated implements DomainEvent {
  readonly eventName = 'ProfessionalProfileUpdated';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly userId: string,
  ) {
    this.occurredOn = new Date();
  }
}
