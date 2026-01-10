import { DomainEvent } from 'src/shared';

export class ProfessionalOnboardingCompleted implements DomainEvent {
  readonly eventName = 'ProfessionalOnboardingCompleted';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly userId: string,
  ) {
    this.occurredOn = new Date();
  }
}
