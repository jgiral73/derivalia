import { DomainEvent } from 'src/shared';

export class PatientCreated implements DomainEvent {
  readonly eventName = 'PatientCreated';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly createdByProfessionalId: string,
  ) {
    this.occurredOn = new Date();
  }
}
