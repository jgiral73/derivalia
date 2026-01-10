import { randomUUID } from 'crypto';
import { DomainEventPublisher } from 'src/shared';
import { Collaboration } from '../../../domain/aggregates';
import { CollaborationScope } from '../../../domain/entities';
import { CollaborationRepository } from '../../../domain/repositories';
import {
  CollaborationId,
  CollaborationPurpose,
  TimeRange,
} from '../../../domain/value-objects';
import { RequestCollaborationCommand } from './RequestCollaborationCommand';

export class RequestCollaborationHandler {
  constructor(
    private readonly collaborations: CollaborationRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: RequestCollaborationCommand): Promise<string> {
    const collaboration = Collaboration.request({
      id: CollaborationId.fromString(randomUUID()),
      patientId: command.patientId,
      requesterProfessionalId: command.requesterProfessionalId,
      collaboratorProfessionalId: command.collaboratorProfessionalId,
      collaboratorEmail: command.collaboratorEmail,
      treatmentId: command.treatmentId,
      purpose: CollaborationPurpose.create(
        command.purposeSpecialty,
        command.purposeDescription,
      ),
      scope: new CollaborationScope(
        command.scopeCanViewClinicalRecords,
        command.scopeCanAddNotes,
        command.scopeCanSuggestTreatment,
        command.scopeCanAccessForms,
      ),
      period: TimeRange.create(command.periodFrom, command.periodTo),
    });

    await this.collaborations.save(collaboration);
    await this.eventPublisher.publish(collaboration.pullDomainEvents());

    return collaboration.id.value;
  }
}
