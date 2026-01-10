import { DomainEventPublisher } from 'src/shared';
import { Consent } from '../../../domain/aggregates';
import { ConsentNotFoundError } from '../../../domain/errors';
import { ConsentRepository } from '../../../domain/repositories';
import {
  ConsentId,
  ConsentPurpose,
  ConsentScope,
} from '../../../domain/value-objects';
import { RequestConformityCommand } from './RequestConformityCommand';
import { RequestConformityHandler } from './RequestConformityHandler';

const buildConsent = () =>
  Consent.request({
    id: ConsentId.fromString('consent-1'),
    patientId: 'patient-1',
    granteeId: 'professional-1',
    scope: ConsentScope.create('patient', 'patient-1'),
    purpose: ConsentPurpose.create('care'),
    validFrom: new Date(),
  });

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

describe('RequestConformityHandler', () => {
  it('throws when consent is missing', async () => {
    const { consents, publisher } = buildDeps();
    (consents.findById as jest.Mock).mockResolvedValue(null);
    const handler = new RequestConformityHandler(consents, publisher);

    await expect(
      handler.execute(
        new RequestConformityCommand('consent-1', 'collaboration'),
      ),
    ).rejects.toThrow(ConsentNotFoundError);
  });

  it('requests conformity and publishes events', async () => {
    const { consents, publisher } = buildDeps();
    const consent = buildConsent();
    (consents.findById as jest.Mock).mockResolvedValue(consent);
    const handler = new RequestConformityHandler(consents, publisher);

    const conformityId = await handler.execute(
      new RequestConformityCommand('consent-1', 'collaboration'),
    );

    expect(conformityId).toBeDefined();
    expect(consents.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
