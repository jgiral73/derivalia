import { randomUUID } from 'crypto';
import { DomainEventPublisher } from 'src/shared';
import { Professional } from '../../../domain/aggregates';
import { ProfessionalAlreadyExistsError } from '../../../domain/errors';
import { ProfessionalRepository } from '../../../domain/repositories';
import { ProfessionalId } from '../../../domain/value-objects';
import { InviteProfessionalCommand } from './InviteProfessionalCommand';

export class InviteProfessionalHandler {
  constructor(
    private readonly professionals: ProfessionalRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: InviteProfessionalCommand): Promise<void> {
    const existing = await this.professionals.findByEmail(command.email);

    if (existing) {
      throw new ProfessionalAlreadyExistsError();
    }

    const professional = Professional.invite({
      id: ProfessionalId.fromString(randomUUID()),
      email: command.email,
    });

    await this.professionals.save(professional);
    await this.eventPublisher.publish(professional.pullDomainEvents());
  }
}
