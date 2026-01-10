import { DomainEventPublisher } from 'src/shared';
import { ProfessionalNotFoundError } from '../../../domain/errors';
import { ProfessionalRepository } from '../../../domain/repositories';
import {
  FullName,
  LicenseNumber,
  ProfessionalId,
  Specialty,
} from '../../../domain/value-objects';
import { CompleteProfessionalOnboardingCommand } from './CompleteProfessionalOnboardingCommand';

export class CompleteProfessionalOnboardingHandler {
  constructor(
    private readonly professionals: ProfessionalRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: CompleteProfessionalOnboardingCommand): Promise<void> {
    const id = ProfessionalId.fromString(command.professionalId);
    const professional = await this.professionals.findById(id);

    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    professional.completeOnboarding({
      fullName: FullName.create(command.fullName),
      licenseNumber: LicenseNumber.create(command.licenseNumber),
      specialties: command.specialties.map((specialty) =>
        Specialty.create(specialty),
      ),
    });

    await this.professionals.save(professional);
    await this.eventPublisher.publish(professional.pullDomainEvents());
  }
}
