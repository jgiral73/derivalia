import { DomainEventPublisher } from 'src/shared';
import { RequestConsentCommand } from './RequestConsentCommand';
import { RequestConsentHandler } from './RequestConsentHandler';
import { ConsentRepository } from '../../../domain/repositories';

const buildDeps = () => {
  const consents: ConsentRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findActiveForPatient: jest.fn(),
  };
  const publisher: DomainEventPublisher = {
    publish: jest.fn(async () => undefined),
  };

  return { consents, publisher };
};

describe('RequestConsentHandler', () => {
  it('saves and publishes events', async () => {
    const { consents, publisher } = buildDeps();
    const handler = new RequestConsentHandler(consents, publisher);

    const consentId = await handler.execute(
      new RequestConsentCommand(
        'patient-1',
        'professional-1',
        'patient',
        'patient-1',
        'care',
        null,
      ),
    );

    expect(consentId).toBeDefined();
    expect(consents.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
