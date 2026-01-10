import { ConsentService } from 'src/contexts/consent/application/services';
import {
  ConsentPurpose,
  ConsentScope,
} from 'src/contexts/consent/domain/value-objects';

import { ConsentChecker } from '../../application/ports/ConsentChecker';

export class ConsentCheckerAdapter implements ConsentChecker {
  constructor(private readonly consentService: ConsentService) {}

  async hasActiveConsent(
    patientId: string,
    professionalId: string,
  ): Promise<boolean> {
    return this.consentService.isAllowed({
      patientId,
      granteeId: professionalId,
      scope: ConsentScope.create('patient', patientId),
      purpose: ConsentPurpose.create('care'),
    });
  }
}
