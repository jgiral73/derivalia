import { Professional } from '../aggregates';
import { ProfessionalId } from '../value-objects';

export interface ProfessionalRepository {
  save(professional: Professional): Promise<void>;
  findById(id: ProfessionalId): Promise<Professional | null>;
  findByUserId(userId: string): Promise<Professional | null>;
  findByEmail(email: string): Promise<Professional | null>;
}
