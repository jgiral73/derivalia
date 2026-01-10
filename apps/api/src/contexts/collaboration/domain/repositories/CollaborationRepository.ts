import { Collaboration } from '../aggregates';
import { CollaborationId } from '../value-objects';

export interface CollaborationRepository {
  save(collaboration: Collaboration): Promise<void>;
  findById(id: CollaborationId): Promise<Collaboration | null>;
}
