import { randomUUID } from 'crypto';
import { DomainEventPublisher } from 'src/shared';
import { Treatment } from '../../../domain/aggregates';
import { TreatmentRepository } from '../../../domain/repositories';
import { TreatmentGoal, TreatmentId } from '../../../domain/value-objects';
import { StartTreatmentCommand } from './StartTreatmentCommand';

export class StartTreatmentHandler {
  constructor(
    private readonly treatments: TreatmentRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: StartTreatmentCommand): Promise<string> {
    const existing = await this.treatments.findActiveForPatient(
      command.patientId,
      command.professionalId,
    );

    if (existing) {
      return existing.id.value;
    }

    const treatment = Treatment.start({
      id: TreatmentId.fromString(randomUUID()),
      patientId: command.patientId,
      professionalId: command.professionalId,
      organizationId: command.organizationId ?? null,
      goal: TreatmentGoal.create(command.goal ?? 'General'),
    });

    await this.treatments.save(treatment);
    await this.eventPublisher.publish(treatment.pullDomainEvents());

    return treatment.id.value;
  }
}
