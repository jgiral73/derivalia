import { DomainEventPublisher } from 'src/shared';
import { Consent } from '../../../domain/aggregates';
import { ConsentNotFoundError } from '../../../domain/errors';
import { ConsentRepository } from '../../../domain/repositories';
import {
  ConsentId,
  ConsentPurpose,
  ConsentScope,
  ConformityType,
} from '../../../domain/value-objects';
import { AcceptConformityCommand } from './AcceptConformityCommand';
import { AcceptConformityHandler } from './AcceptConformityHandler';

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

describe('AcceptConformityHandler', () => {
  it('throws when consent is missing', async () => {
    const { consents, publisher } = buildDeps();
    (consents.findById as jest.Mock).mockResolvedValue(null);
    const handler = new AcceptConformityHandler(consents, publisher);

    await expect(
      handler.execute(new AcceptConformityCommand('consent-1', 'conf-1')),
    ).rejects.toThrow(ConsentNotFoundError);
  });

  it('accepts conformity and publishes events', async () => {
    const { consents, publisher } = buildDeps();
    const consent = buildConsent();
    const conformity = consent.requestConformity({
      id: 'conf-1',
      type: ConformityType.create('collaboration'),
    });
    (consents.findById as jest.Mock).mockResolvedValue(consent);
    const handler = new AcceptConformityHandler(consents, publisher);

    await handler.execute(
      new AcceptConformityCommand('consent-1', conformity.id),
    );

    expect(conformity.getStatus().value).toBe('accepted');
    expect(consents.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
