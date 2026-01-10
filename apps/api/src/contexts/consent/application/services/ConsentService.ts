import { ConsentRepository } from '../../domain/repositories';
import { ConsentPurpose, ConsentScope } from '../../domain/value-objects';

export class ConsentService {
  constructor(private readonly consents: ConsentRepository) {}

  async isAllowed(input: {
    patientId: string;
    granteeId: string;
    scope: ConsentScope;
    purpose: ConsentPurpose;
  }): Promise<boolean> {
    const consents = await this.consents.findActiveForPatient(
      input.patientId,
      input.granteeId,
    );

    const relevant = consents.filter(
      (consent) =>
        consent.scope.matches(input.scope) &&
        consent.purpose.value === input.purpose.value,
    );

    if (relevant.some((consent) => consent.getDecision().value === 'deny')) {
      return false;
    }

    return relevant.some((consent) => consent.getDecision().value === 'allow');
  }
}
