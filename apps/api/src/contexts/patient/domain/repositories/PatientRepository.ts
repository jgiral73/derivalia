import { Patient } from '../aggregates';
import { PatientId } from '../value-objects';

export interface PatientRepository {
  save(patient: Patient): Promise<void>;
  findById(id: PatientId): Promise<Patient | null>;
  findByProfessional(professionalId: string): Promise<Patient[]>;
}
