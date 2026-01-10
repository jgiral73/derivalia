import { CreatePatientHandler } from './CreatePatientHandler';
import { CreatePatientCommand } from './CreatePatientCommand';
import { DomainEventPublisher } from 'src/shared';
import { PatientRepository } from '../../../domain/repositories';

describe('CreatePatientHandler', () => {
  it('saves patient and publishes events', async () => {
    const patients: PatientRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByProfessional: jest.fn(),
    };
    const publisher: DomainEventPublisher = {
        publish: jest.fn(async () => undefined),
    };

    const handler = new CreatePatientHandler(patients, publisher);

    await handler.execute(
      new CreatePatientCommand('prof-1', 'Jane Doe', '2000-01-01'),
    );

    expect(patients.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
