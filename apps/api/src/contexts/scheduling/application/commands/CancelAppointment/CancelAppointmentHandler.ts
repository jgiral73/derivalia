import { DomainEventPublisher } from 'src/shared';
import { AppointmentNotFoundError } from '../../../domain/errors';
import { AppointmentRepository } from '../../../domain/repositories';
import { CancelAppointmentCommand } from './CancelAppointmentCommand';

export class CancelAppointmentHandler {
  constructor(
    private readonly appointments: AppointmentRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: CancelAppointmentCommand): Promise<void> {
    const appointment = await this.appointments.findById(command.appointmentId);

    if (!appointment) {
      throw new AppointmentNotFoundError();
    }

    appointment.cancel();

    await this.appointments.save(appointment);
    await this.eventPublisher.publish(appointment.pullDomainEvents());
  }
}
