import { DomainEventPublisher } from 'src/shared';
import { TreatmentNotFoundError } from '../../../domain/errors';
import { TreatmentRepository } from '../../../domain/repositories';
import { TreatmentId } from '../../../domain/value-objects';
import { CloseTreatmentCommand } from './CloseTreatmentCommand';

export class CloseTreatmentHandler {
  constructor(
    private readonly treatments: TreatmentRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: CloseTreatmentCommand): Promise<void> {
    const id = TreatmentId.fromString(command.treatmentId);
    const treatment = await this.treatments.findById(id);

    if (!treatment) {
      throw new TreatmentNotFoundError();
    }

    treatment.close();

    await this.treatments.save(treatment);
    await this.eventPublisher.publish(treatment.pullDomainEvents());
  }
}
