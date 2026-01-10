import { DomainEventPublisher } from 'src/shared';
import { Consent } from '../../../domain/aggregates';
import { ConsentNotFoundError } from '../../../domain/errors';
import { ConsentRepository } from '../../../domain/repositories';
import {
  ConsentId,
  ConsentPurpose,
  ConsentScope,
} from '../../../domain/value-objects';
import { RevokeConsentCommand } from './RevokeConsentCommand';
import { RevokeConsentHandler } from './RevokeConsentHandler';

const buildConsent = () =>
  Consent.grant({
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

describe('RevokeConsentHandler', () => {
  it('throws when consent is missing', async () => {
    const { consents, publisher } = buildDeps();
    (consents.findById as jest.Mock).mockResolvedValue(null);
    const handler = new RevokeConsentHandler(consents, publisher);

    await expect(
      handler.execute(new RevokeConsentCommand('consent-1')),
    ).rejects.toThrow(ConsentNotFoundError);
  });

  it('revokes and publishes events', async () => {
    const { consents, publisher } = buildDeps();
    const consent = buildConsent();
    (consents.findById as jest.Mock).mockResolvedValue(consent);
    const handler = new RevokeConsentHandler(consents, publisher);

    await handler.execute(new RevokeConsentCommand('consent-1'));

    expect(consent.getDecision().value).toBe('deny');
    expect(consents.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
