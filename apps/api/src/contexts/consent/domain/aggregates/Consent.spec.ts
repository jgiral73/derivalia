import { Consent } from './Consent';
import { ConformityAlreadyDecidedError } from '../errors';
import {
  ConsentId,
  ConsentPurpose,
  ConsentScope,
  ConformityType,
} from '../value-objects';

const buildConsent = () =>
  Consent.request({
    id: ConsentId.fromString('consent-1'),
    patientId: 'patient-1',
    granteeId: 'professional-1',
    scope: ConsentScope.create('patient', 'patient-1'),
    purpose: ConsentPurpose.create('care'),
    validFrom: new Date(),
  });

describe('Consent aggregate', () => {
  it('requests consent and emits ConsentRequested', () => {
    const consent = buildConsent();

    const events = consent.pullDomainEvents();

    expect(events.map((event) => event.eventName)).toEqual([
      'ConsentRequested',
    ]);
  });

  it('grants consent and emits ConsentGranted', () => {
    const consent = buildConsent();
    consent.pullDomainEvents();

    consent.grant();

    const events = consent.pullDomainEvents();

    expect(consent.getDecision().value).toBe('allow');
    expect(events.map((event) => event.eventName)).toEqual(['ConsentGranted']);
  });

  it('revokes consent and emits ConsentRevoked', () => {
    const consent = buildConsent();
    consent.pullDomainEvents();
    consent.grant();
    consent.pullDomainEvents();

    consent.revoke();

    const events = consent.pullDomainEvents();

    expect(consent.getDecision().value).toBe('deny');
    expect(events.map((event) => event.eventName)).toEqual(['ConsentRevoked']);
  });

  it('requests conformity and emits ConformityRequested', () => {
    const consent = buildConsent();
    consent.pullDomainEvents();

    consent.requestConformity({
      id: 'conf-1',
      type: ConformityType.create('collaboration'),
    });

    const events = consent.pullDomainEvents();

    expect(events.map((event) => event.eventName)).toEqual([
      'ConformityRequested',
    ]);
  });

  it('accepts conformity and emits ConformityAccepted', () => {
    const consent = buildConsent();
    consent.pullDomainEvents();
    const conformity = consent.requestConformity({
      id: 'conf-2',
      type: ConformityType.create('collaboration'),
    });
    consent.pullDomainEvents();

    consent.acceptConformity(conformity.id);

    const events = consent.pullDomainEvents();

    expect(conformity.getStatus().value).toBe('accepted');
    expect(events.map((event) => event.eventName)).toEqual([
      'ConformityAccepted',
    ]);
  });

  it('rejects double decision on conformity', () => {
    const consent = buildConsent();
    consent.pullDomainEvents();
    const conformity = consent.requestConformity({
      id: 'conf-3',
      type: ConformityType.create('collaboration'),
    });
    consent.pullDomainEvents();

    consent.rejectConformity(conformity.id);

    expect(() => consent.acceptConformity(conformity.id)).toThrow(
      ConformityAlreadyDecidedError,
    );
  });
});
