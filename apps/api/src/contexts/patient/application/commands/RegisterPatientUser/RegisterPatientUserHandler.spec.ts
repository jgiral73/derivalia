import { RegisterPatientUserHandler } from './RegisterPatientUserHandler';
import { RegisterPatientUserCommand } from './RegisterPatientUserCommand';
import { PatientNotFoundError } from '../../../domain/errors';
import { DomainEventPublisher } from 'src/shared';
import { PatientRepository } from '../../../domain/repositories';
import { Patient } from '../../../domain/aggregates';
import {
  ContactInfo,
  PatientId,
  PatientName,
} from '../../../domain/value-objects';

describe('RegisterPatientUserHandler', () => {
  const buildPatient = () => {
    const patient = Patient.create({
      id: PatientId.fromString('patient-1'),
      name: PatientName.create('Jane Doe'),
      createdByProfessionalId: 'prof-1',
    });
    patient.invite(ContactInfo.create({ email: 'pat@example.com' }));
    return patient;
  };

  it('throws when patient is missing', async () => {
    const patients: PatientRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByProfessional: jest.fn(),
    };
    const publisher: DomainEventPublisher = {
      publish: jest.fn(async () => undefined),
    };

    (patients.findById as jest.Mock).mockResolvedValue(null);

    const handler = new RegisterPatientUserHandler(patients, publisher);

    await expect(
      handler.execute(new RegisterPatientUserCommand('patient-1', 'user-1')),
    ).rejects.toThrow(PatientNotFoundError);
  });

  it('saves and publishes on success', async () => {
    const patients: PatientRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByProfessional: jest.fn(),
    };
    const publisher: DomainEventPublisher = {
      publish: jest.fn(async () => undefined),
    };

    (patients.findById as jest.Mock).mockResolvedValue(buildPatient());

    const handler = new RegisterPatientUserHandler(patients, publisher);

    await handler.execute(new RegisterPatientUserCommand('patient-1', 'user-1'));

    expect(patients.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
