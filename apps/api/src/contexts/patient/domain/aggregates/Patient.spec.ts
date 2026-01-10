import { Patient } from '.';
import {
  BirthDate,
  ContactInfo,
  PatientId,
  PatientName,
  PatientStatus,
} from '../value-objects';
import { PatientStateTransitionNotAllowedError } from '../errors';

describe('Patient aggregate', () => {
  const id = PatientId.fromString('patient-1');
  const name = PatientName.create('Jane Doe');

  it('creates and emits PatientCreated', () => {
    const patient = Patient.create({
      id,
      name,
      createdByProfessionalId: 'prof-1',
      birthDate: BirthDate.fromDate(new Date('2000-01-01')),
    });

    const events = patient.pullDomainEvents();

    expect(events.map((event) => event.eventName)).toEqual(['PatientCreated']);
  });

  it('invites and sets status to invited', () => {
    const patient = Patient.create({
      id,
      name,
      createdByProfessionalId: 'prof-1',
    });

    patient.invite(ContactInfo.create({ email: 'pat@example.com' }));

    expect(patient.getStatus().value).toBe(PatientStatus.Invited.value);
  });

  it('registers user and sets status to active', () => {
    const patient = Patient.create({
      id,
      name,
      createdByProfessionalId: 'prof-1',
    });

    patient.invite(ContactInfo.create({ email: 'pat@example.com' }));
    patient.registerUser('user-1');

    expect(patient.getStatus().value).toBe(PatientStatus.Active.value);
    expect(patient.getUserId()).toBe('user-1');
  });

  it('rejects register user when not invited', () => {
    const patient = Patient.create({
      id,
      name,
      createdByProfessionalId: 'prof-1',
    });

    expect(() => patient.registerUser('user-1')).toThrow(
      PatientStateTransitionNotAllowedError,
    );
  });
});
