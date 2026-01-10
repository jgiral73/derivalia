import { DomainEventPublisher } from 'src/shared';
import { Appointment } from '../../../domain/aggregates';
import { AppointmentNotFoundError } from '../../../domain/errors';
import { AppointmentRepository } from '../../../domain/repositories';
import { AppointmentType, TimeSlot } from '../../../domain/value-objects';
import { CancelAppointmentCommand } from './CancelAppointmentCommand';
import { CancelAppointmentHandler } from './CancelAppointmentHandler';

const buildAppointment = () =>
  Appointment.schedule({
    id: 'appt-1',
    professionalId: 'pro-1',
    patientId: 'patient-1',
    organizationId: null,
    treatmentId: null,
    timeSlot: TimeSlot.create(
      new Date('2026-01-01T10:00:00.000Z'),
      new Date('2026-01-01T11:00:00.000Z'),
    ),
    type: AppointmentType.Visit,
  });

const buildDeps = () => {
  const appointments: AppointmentRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findOverlapping: jest.fn(),
  };
  const publisher: DomainEventPublisher = {
    publish: jest.fn(() => Promise.resolve()),
  };

  return { appointments, publisher };
};

describe('CancelAppointmentHandler', () => {
  it('throws when appointment is missing', async () => {
    const { appointments, publisher } = buildDeps();
    (appointments.findById as jest.Mock).mockResolvedValue(null);
    const handler = new CancelAppointmentHandler(appointments, publisher);

    await expect(
      handler.execute(new CancelAppointmentCommand('appt-1')),
    ).rejects.toThrow(AppointmentNotFoundError);
  });

  it('cancels and publishes events', async () => {
    const { appointments, publisher } = buildDeps();
    const appointment = buildAppointment();
    (appointments.findById as jest.Mock).mockResolvedValue(appointment);
    const handler = new CancelAppointmentHandler(appointments, publisher);

    await handler.execute(new CancelAppointmentCommand('appt-1'));

    expect(appointment.getStatus().value).toBe('cancelled');
    const save = appointments.save as jest.Mock;
    const publish = publisher.publish as jest.Mock;
    expect(save).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledTimes(1);
  });
});
