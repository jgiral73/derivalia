import { randomUUID } from 'crypto';
import { DomainEventPublisher } from 'src/shared';
import { Professional } from '../../../domain/aggregates';
import { ProfessionalAlreadyExistsError } from '../../../domain/errors';
import { ProfessionalRepository } from '../../../domain/repositories';
import { ProfessionalId } from '../../../domain/value-objects';
import { CreateProfessionalCommand } from './CreateProfessionalCommand';

export class CreateProfessionalHandler {
  constructor(
    private readonly professionals: ProfessionalRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: CreateProfessionalCommand): Promise<void> {
    const existing = await this.professionals.findByUserId(command.userId);

    if (existing) {
      throw new ProfessionalAlreadyExistsError();
    }

    if (command.email) {
      const existingEmail = await this.professionals.findByEmail(command.email);
      if (existingEmail) {
        throw new ProfessionalAlreadyExistsError();
      }
    }

    const professional = Professional.create({
      id: ProfessionalId.fromString(randomUUID()),
      userId: command.userId,
      email: command.email ?? null,
    });

    await this.professionals.save(professional);
    await this.eventPublisher.publish(professional.pullDomainEvents());
  }
}
