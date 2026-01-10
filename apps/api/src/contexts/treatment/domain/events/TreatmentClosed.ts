import { DomainEvent } from 'src/shared';

export class TreatmentClosed implements DomainEvent {
  readonly eventName = 'TreatmentClosed';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly patientId: string,
    public readonly professionalId: string,
  ) {
    this.occurredOn = new Date();
  }
}
