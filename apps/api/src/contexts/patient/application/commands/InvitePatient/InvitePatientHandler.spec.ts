import { InvitePatientHandler } from './InvitePatientHandler';
import { InvitePatientCommand } from './InvitePatientCommand';
import { PatientNotFoundError } from '../../../domain/errors';
import { DomainEventPublisher } from 'src/shared';
import { PatientRepository } from '../../../domain/repositories';
import { Patient } from '../../../domain/aggregates';
import { PatientId, PatientName } from '../../../domain/value-objects';

describe('InvitePatientHandler', () => {
  const buildPatient = () =>
    Patient.create({
      id: PatientId.fromString('patient-1'),
      name: PatientName.create('Jane Doe'),
      createdByProfessionalId: 'prof-1',
    });

  it('throws when patient is missing', async () => {
    const patients: PatientRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByProfessional: jest.fn(),
    };
    const publisher: DomainEventPublisher = {
      // eslint-disable-next-line @typescript-eslint/require-await
      publish: jest.fn(async () => undefined),
    };

    (patients.findById as jest.Mock).mockResolvedValue(null);

    const handler = new InvitePatientHandler(patients, publisher);

    await expect(
      handler.execute(new InvitePatientCommand('patient-1', 'pat@example.com')),
    ).rejects.toThrow(PatientNotFoundError);
  });

  it('saves and publishes on success', async () => {
    const patients: PatientRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByProfessional: jest.fn(),
    };
    const publisher: DomainEventPublisher = {
      // eslint-disable-next-line @typescript-eslint/require-await
      publish: jest.fn(async () => undefined),
    };

    (patients.findById as jest.Mock).mockResolvedValue(buildPatient());

    const handler = new InvitePatientHandler(patients, publisher);

    await handler.execute(
      new InvitePatientCommand('patient-1', 'pat@example.com'),
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(patients.save).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
