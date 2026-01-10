import { DomainEventPublisher } from 'src/shared';
import { PatientNotFoundError } from '../../../domain/errors';
import { PatientRepository } from '../../../domain/repositories';
import { ContactInfo, PatientId } from '../../../domain/value-objects';
import { InvitePatientCommand } from './InvitePatientCommand';

export class InvitePatientHandler {
  constructor(
    private readonly patients: PatientRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: InvitePatientCommand): Promise<void> {
    const id = PatientId.fromString(command.patientId);
    const patient = await this.patients.findById(id);

    if (!patient) {
      throw new PatientNotFoundError();
    }

    const contactInfo = ContactInfo.create({
      email: command.email,
      phone: command.phone,
    });

    patient.invite(contactInfo);

    await this.patients.save(patient);
    await this.eventPublisher.publish(patient.pullDomainEvents());
  }
}
