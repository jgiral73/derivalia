import { Appointment } from './Appointment';
import { AppointmentType, TimeSlot } from '../value-objects';

describe('Appointment aggregate', () => {
  it('schedules and emits AppointmentScheduled', () => {
    const appointment = Appointment.schedule({
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

    const events = appointment.pullDomainEvents();

    expect(events.map((event) => event.eventName)).toEqual([
      'AppointmentScheduled',
    ]);
  });

  it('cancels and emits AppointmentCancelled', () => {
    const appointment = Appointment.schedule({
      id: 'appt-2',
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
    appointment.pullDomainEvents();

    appointment.cancel();

    const events = appointment.pullDomainEvents();

    expect(events.map((event) => event.eventName)).toEqual([
      'AppointmentCancelled',
    ]);
  });

  it('reschedules and emits AppointmentRescheduled', () => {
    const appointment = Appointment.schedule({
      id: 'appt-3',
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
    appointment.pullDomainEvents();

    appointment.reschedule('appt-4');

    const events = appointment.pullDomainEvents();

    expect(events.map((event) => event.eventName)).toEqual([
      'AppointmentRescheduled',
    ]);
  });
});
