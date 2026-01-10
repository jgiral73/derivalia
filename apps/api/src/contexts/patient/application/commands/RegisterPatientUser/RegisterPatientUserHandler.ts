import { DomainEventPublisher } from 'src/shared';
import { PatientNotFoundError } from '../../../domain/errors';
import { PatientRepository } from '../../../domain/repositories';
import { PatientId } from '../../../domain/value-objects';
import { RegisterPatientUserCommand } from './RegisterPatientUserCommand';

export class RegisterPatientUserHandler {
  constructor(
    private readonly patients: PatientRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: RegisterPatientUserCommand): Promise<void> {
    const id = PatientId.fromString(command.patientId);
    const patient = await this.patients.findById(id);

    if (!patient) {
      throw new PatientNotFoundError();
    }

    patient.registerUser(command.userId);

    await this.patients.save(patient);
    await this.eventPublisher.publish(patient.pullDomainEvents());
  }
}
