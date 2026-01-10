import { DomainEventPublisher } from 'src/shared';
import { ScheduleAppointmentCommand } from './ScheduleAppointmentCommand';
import { ScheduleAppointmentHandler } from './ScheduleAppointmentHandler';
import { ConsentRequiredError } from '../../../domain/errors';
import { AppointmentRepository } from '../../../domain/repositories';
import { AvailabilityPolicy } from '../../../domain/services';
import { ConsentChecker } from '../../ports/ConsentChecker';

const buildDeps = () => {
  const appointments: AppointmentRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findOverlapping: jest.fn(),
  };
  const availability: AvailabilityPolicy = {
    assertAvailable: jest.fn(async () => undefined),
  } as unknown as AvailabilityPolicy;
  const consentChecker: ConsentChecker = {
    hasActiveConsent: jest.fn(),
  };
  const publisher: DomainEventPublisher = {
    publish: jest.fn(async () => undefined),
  };

  return { appointments, availability, consentChecker, publisher };
};

describe('ScheduleAppointmentHandler', () => {
  it('rejects when consent is missing', async () => {
    const { appointments, availability, consentChecker, publisher } =
      buildDeps();
    (consentChecker.hasActiveConsent as jest.Mock).mockResolvedValue(false);
    const handler = new ScheduleAppointmentHandler(
      appointments,
      availability,
      consentChecker,
      publisher,
    );

    await expect(
      handler.execute(
        new ScheduleAppointmentCommand(
          'pro-1',
          'patient-1',
          null,
          null,
          new Date('2026-01-01T10:00:00.000Z'),
          new Date('2026-01-01T11:00:00.000Z'),
          'visit',
        ),
      ),
    ).rejects.toThrow(ConsentRequiredError);
  });

  it('saves and publishes on success', async () => {
    const { appointments, availability, consentChecker, publisher } =
      buildDeps();
    (consentChecker.hasActiveConsent as jest.Mock).mockResolvedValue(true);
    const handler = new ScheduleAppointmentHandler(
      appointments,
      availability,
      consentChecker,
      publisher,
    );

    const appointmentId = await handler.execute(
      new ScheduleAppointmentCommand(
        'pro-1',
        'patient-1',
        null,
        null,
        new Date('2026-01-01T10:00:00.000Z'),
        new Date('2026-01-01T11:00:00.000Z'),
        'visit',
      ),
    );

    expect(appointmentId).toBeDefined();
    expect(appointments.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
