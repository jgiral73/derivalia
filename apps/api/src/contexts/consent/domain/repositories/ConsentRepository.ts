import { Consent } from '../aggregates';
import { ConsentId } from '../value-objects';

export interface ConsentRepository {
  save(consent: Consent): Promise<void>;
  findById(id: ConsentId): Promise<Consent | null>;
  findActiveForPatient(
    patientId: string,
    granteeId: string,
  ): Promise<Consent[]>;
}
