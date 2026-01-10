import { randomUUID } from 'crypto';
import { DomainEventPublisher } from 'src/shared';
import { Appointment } from '../../../domain/aggregates';
import { AppointmentNotFoundError } from '../../../domain/errors';
import { AppointmentRepository } from '../../../domain/repositories';
import { AvailabilityPolicy } from '../../../domain/services';
import { TimeSlot } from '../../../domain/value-objects';
import { RescheduleAppointmentCommand } from './RescheduleAppointmentCommand';

export class RescheduleAppointmentHandler {
  constructor(
    private readonly appointments: AppointmentRepository,
    private readonly availability: AvailabilityPolicy,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: RescheduleAppointmentCommand): Promise<string> {
    const appointment = await this.appointments.findById(command.appointmentId);

    if (!appointment) {
      throw new AppointmentNotFoundError();
    }

    const timeSlot = TimeSlot.create(command.startAt, command.endAt);
    await this.availability.assertAvailable(
      appointment.professionalId,
      timeSlot,
    );

    const newAppointmentId = randomUUID();
    appointment.reschedule(newAppointmentId);

    const newAppointment = Appointment.schedule({
      id: newAppointmentId,
      professionalId: appointment.professionalId,
      patientId: appointment.patientId,
      organizationId: appointment.organizationId,
      treatmentId: appointment.treatmentId,
      timeSlot,
      type: appointment.type,
    });

    await this.appointments.save(appointment);
    await this.eventPublisher.publish(appointment.pullDomainEvents());

    await this.appointments.save(newAppointment);
    await this.eventPublisher.publish(newAppointment.pullDomainEvents());

    return newAppointment.id;
  }
}
