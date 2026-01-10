import { DomainEvent } from 'src/shared';

export class ProfessionalInvited implements DomainEvent {
  readonly eventName = 'ProfessionalInvited';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly email: string,
  ) {
    this.occurredOn = new Date();
  }
}
