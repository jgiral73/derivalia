import { DomainEvent } from 'src/shared';

export class TreatmentStarted implements DomainEvent {
  readonly eventName = 'TreatmentStarted';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly patientId: string,
    public readonly professionalId: string,
  ) {
    this.occurredOn = new Date();
  }
}
