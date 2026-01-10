import { DomainEventPublisher } from 'src/shared';
import { Consent } from '../../../domain/aggregates';
import { ConsentNotFoundError } from '../../../domain/errors';
import { ConsentRepository } from '../../../domain/repositories';
import {
  ConsentId,
  ConsentPurpose,
  ConsentScope,
} from '../../../domain/value-objects';
import { GrantConsentCommand } from './GrantConsentCommand';
import { GrantConsentHandler } from './GrantConsentHandler';

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

describe('GrantConsentHandler', () => {
  it('throws when consent is missing', async () => {
    const { consents, publisher } = buildDeps();
    (consents.findById as jest.Mock).mockResolvedValue(null);
    const handler = new GrantConsentHandler(consents, publisher);

    await expect(
      handler.execute(new GrantConsentCommand('consent-1', null)),
    ).rejects.toThrow(ConsentNotFoundError);
  });

  it('grants and publishes events', async () => {
    const { consents, publisher } = buildDeps();
    const consent = buildConsent();
    (consents.findById as jest.Mock).mockResolvedValue(consent);
    const handler = new GrantConsentHandler(consents, publisher);

    await handler.execute(new GrantConsentCommand('consent-1', null));

    expect(consent.getDecision().value).toBe('allow');
    expect(consents.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
