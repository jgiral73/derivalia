import { DomainEventPublisher } from 'src/shared';
import { Appointment } from '../../../domain/aggregates';
import { AppointmentNotFoundError } from '../../../domain/errors';
import { AppointmentRepository } from '../../../domain/repositories';
import { AvailabilityPolicy } from '../../../domain/services';
import { AppointmentType, TimeSlot } from '../../../domain/value-objects';
import { RescheduleAppointmentCommand } from './RescheduleAppointmentCommand';
import { RescheduleAppointmentHandler } from './RescheduleAppointmentHandler';

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
  const availability: AvailabilityPolicy = {
    assertAvailable: jest.fn(async () => undefined),
  } as unknown as AvailabilityPolicy;
  const publisher: DomainEventPublisher = {
    publish: jest.fn(async () => undefined),
  };

  return { appointments, availability, publisher };
};

describe('RescheduleAppointmentHandler', () => {
  it('throws when appointment is missing', async () => {
    const { appointments, availability, publisher } = buildDeps();
    (appointments.findById as jest.Mock).mockResolvedValue(null);
    const handler = new RescheduleAppointmentHandler(
      appointments,
      availability,
      publisher,
    );

    await expect(
      handler.execute(
        new RescheduleAppointmentCommand(
          'appt-1',
          new Date('2026-01-02T10:00:00.000Z'),
          new Date('2026-01-02T11:00:00.000Z'),
        ),
      ),
    ).rejects.toThrow(AppointmentNotFoundError);
  });

  it('reschedules and publishes events', async () => {
    const { appointments, availability, publisher } = buildDeps();
    const appointment = buildAppointment();
    (appointments.findById as jest.Mock).mockResolvedValue(appointment);
    const handler = new RescheduleAppointmentHandler(
      appointments,
      availability,
      publisher,
    );

    const newId = await handler.execute(
      new RescheduleAppointmentCommand(
        'appt-1',
        new Date('2026-01-02T10:00:00.000Z'),
        new Date('2026-01-02T11:00:00.000Z'),
      ),
    );

    expect(newId).toBeDefined();
    expect(appointments.save).toHaveBeenCalledTimes(2);
    expect(publisher.publish).toHaveBeenCalledTimes(2);
  });
});
