import { DomainEventPublisher } from 'src/shared';
import { ProfessionalNotFoundError } from '../../../domain/errors';
import { ProfessionalRepository } from '../../../domain/repositories';
import {
  FullName,
  LicenseNumber,
  ProfessionalId,
  Specialty,
} from '../../../domain/value-objects';
import { UpdateProfessionalProfileCommand } from './UpdateProfessionalProfileCommand';

export class UpdateProfessionalProfileHandler {
  constructor(
    private readonly professionals: ProfessionalRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: UpdateProfessionalProfileCommand): Promise<void> {
    const id = ProfessionalId.fromString(command.professionalId);
    const professional = await this.professionals.findById(id);

    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    professional.updateProfile({
      fullName: command.fullName
        ? FullName.create(command.fullName)
        : undefined,
      licenseNumber: command.licenseNumber
        ? LicenseNumber.create(command.licenseNumber)
        : undefined,
      specialties: command.specialties
        ? command.specialties.map((specialty) => Specialty.create(specialty))
        : undefined,
    });

    await this.professionals.save(professional);
    await this.eventPublisher.publish(professional.pullDomainEvents());
  }
}
