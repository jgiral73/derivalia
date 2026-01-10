import { DomainEvent } from 'src/shared';

export class ProfessionalCreated implements DomainEvent {
  readonly eventName = 'ProfessionalCreated';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly userId: string,
  ) {
    this.occurredOn = new Date();
  }
}
