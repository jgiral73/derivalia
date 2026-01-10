import { Consent } from '../../domain/aggregates';
import { ConsentRepository } from '../../domain/repositories';
import {
  ConsentId,
  ConsentPurpose,
  ConsentScope,
} from '../../domain/value-objects';
import { ConsentService } from './ConsentService';

const buildConsent = (decision: 'allow' | 'deny') => {
  if (decision === 'allow') {
    return Consent.grant({
      id: ConsentId.fromString('consent-1'),
      patientId: 'patient-1',
      granteeId: 'professional-1',
      scope: ConsentScope.create('patient', 'patient-1'),
      purpose: ConsentPurpose.create('care'),
      validFrom: new Date(),
    });
  }

  return Consent.request({
    id: ConsentId.fromString('consent-2'),
    patientId: 'patient-1',
    granteeId: 'professional-1',
    scope: ConsentScope.create('patient', 'patient-1'),
    purpose: ConsentPurpose.create('care'),
    validFrom: new Date(),
  });
};

describe('ConsentService', () => {
  it('allows when a matching allow consent exists', async () => {
    const consents: ConsentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findActiveForPatient: jest.fn(),
    };
    (consents.findActiveForPatient as jest.Mock).mockResolvedValue([
      buildConsent('allow'),
    ]);

    const service = new ConsentService(consents);
    const result = await service.isAllowed({
      patientId: 'patient-1',
      granteeId: 'professional-1',
      scope: ConsentScope.create('patient', 'patient-1'),
      purpose: ConsentPurpose.create('care'),
    });

    expect(result).toBe(true);
  });

  it('denies when a matching deny consent exists', async () => {
    const consents: ConsentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findActiveForPatient: jest.fn(),
    };
    (consents.findActiveForPatient as jest.Mock).mockResolvedValue([
      buildConsent('deny'),
    ]);

    const service = new ConsentService(consents);
    const result = await service.isAllowed({
      patientId: 'patient-1',
      granteeId: 'professional-1',
      scope: ConsentScope.create('patient', 'patient-1'),
      purpose: ConsentPurpose.create('care'),
    });

    expect(result).toBe(false);
  });
});
