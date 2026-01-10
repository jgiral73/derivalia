import { DomainEventPublisher } from 'src/shared';
import { ProfessionalNotFoundError } from '../../../domain/errors';
import { ProfessionalRepository } from '../../../domain/repositories';
import { ProfessionalId } from '../../../domain/value-objects';
import { SuspendProfessionalCommand } from './SuspendProfessionalCommand';

export class SuspendProfessionalHandler {
  constructor(
    private readonly professionals: ProfessionalRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: SuspendProfessionalCommand): Promise<void> {
    const id = ProfessionalId.fromString(command.professionalId);
    const professional = await this.professionals.findById(id);

    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    professional.suspend(command.reason);

    await this.professionals.save(professional);
    await this.eventPublisher.publish(professional.pullDomainEvents());
  }
}
