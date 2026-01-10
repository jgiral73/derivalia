import { DomainEvent } from 'src/shared';

export class ProfessionalSuspended implements DomainEvent {
  readonly eventName = 'ProfessionalSuspended';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly reason?: string,
  ) {
    this.occurredOn = new Date();
  }
}
