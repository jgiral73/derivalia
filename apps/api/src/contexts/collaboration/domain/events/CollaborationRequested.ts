import { DomainEvent } from 'src/shared';

export class CollaborationRequested implements DomainEvent {
  readonly eventName = 'CollaborationRequested';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly patientId: string,
    public readonly requesterProfessionalId: string,
    public readonly collaboratorProfessionalId: string | null,
    public readonly collaboratorEmail: string | null,
    public readonly treatmentId: string | null,
  ) {
    this.occurredOn = new Date();
  }
}
