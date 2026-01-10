import { DomainEventPublisher } from 'src/shared';
import { PatientNotFoundError } from '../../../domain/errors';
import { PatientRepository } from '../../../domain/repositories';
import { PatientId } from '../../../domain/value-objects';
import { ArchivePatientCommand } from './ArchivePatientCommand';

export class ArchivePatientHandler {
  constructor(
    private readonly patients: PatientRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: ArchivePatientCommand): Promise<void> {
    const id = PatientId.fromString(command.patientId);
    const patient = await this.patients.findById(id);

    if (!patient) {
      throw new PatientNotFoundError();
    }

    patient.archive();

    await this.patients.save(patient);
    await this.eventPublisher.publish(patient.pullDomainEvents());
  }
}
