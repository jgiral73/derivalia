import { randomUUID } from 'crypto';
import { DomainEventPublisher } from 'src/shared';
import { Appointment } from '../../../domain/aggregates';
import { ConsentRequiredError } from '../../../domain/errors';
import { AppointmentRepository } from '../../../domain/repositories';
import { AvailabilityPolicy } from '../../../domain/services';
import { AppointmentType, TimeSlot } from '../../../domain/value-objects';
import { ConsentChecker } from '../../ports/ConsentChecker';
import { ScheduleAppointmentCommand } from './ScheduleAppointmentCommand';

export class ScheduleAppointmentHandler {
  constructor(
    private readonly appointments: AppointmentRepository,
    private readonly availability: AvailabilityPolicy,
    private readonly consentChecker: ConsentChecker,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: ScheduleAppointmentCommand): Promise<string> {
    if (command.patientId) {
      const hasConsent = await this.consentChecker.hasActiveConsent(
        command.patientId,
        command.professionalId,
      );
      if (!hasConsent) {
        throw new ConsentRequiredError();
      }
    }

    const timeSlot = TimeSlot.create(command.startAt, command.endAt);
    await this.availability.assertAvailable(command.professionalId, timeSlot);

    const appointment = Appointment.schedule({
      id: randomUUID(),
      professionalId: command.professionalId,
      patientId: command.patientId,
      organizationId: command.organizationId,
      treatmentId: command.treatmentId,
      timeSlot,
      type: AppointmentType.fromValue(command.type),
    });

    await this.appointments.save(appointment);
    await this.eventPublisher.publish(appointment.pullDomainEvents());

    return appointment.id;
  }
}
