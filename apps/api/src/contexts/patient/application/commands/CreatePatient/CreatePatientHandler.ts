import { randomUUID } from 'crypto';
import { DomainEventPublisher } from 'src/shared';
import { Patient } from '../../../domain/aggregates';
import { PatientRepository } from '../../../domain/repositories';
import {
  BirthDate,
  ContactInfo,
  PatientId,
  PatientName,
} from '../../../domain/value-objects';
import { CreatePatientCommand } from './CreatePatientCommand';

export class CreatePatientHandler {
  constructor(
    private readonly patients: PatientRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: CreatePatientCommand): Promise<void> {
    const id = PatientId.fromString(randomUUID());
    const name = PatientName.create(command.fullName);
    const birthDate = command.birthDate
      ? BirthDate.fromDate(new Date(command.birthDate))
      : null;
    const contactInfo =
      command.email || command.phone
        ? ContactInfo.create({ email: command.email, phone: command.phone })
        : null;

    const patient = Patient.create({
      id,
      name,
      createdByProfessionalId: command.professionalId,
      birthDate,
      contactInfo,
    });

    await this.patients.save(patient);
    await this.eventPublisher.publish(patient.pullDomainEvents());
  }
}
