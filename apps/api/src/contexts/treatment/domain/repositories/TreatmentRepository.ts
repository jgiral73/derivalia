import { Treatment } from '../aggregates';
import { TreatmentId } from '../value-objects';

export interface TreatmentRepository {
  save(treatment: Treatment): Promise<void>;
  findById(id: TreatmentId): Promise<Treatment | null>;
  findActiveForPatient(
    patientId: string,
    professionalId: string,
  ): Promise<Treatment | null>;
}
