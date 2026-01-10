import { Organization } from '../aggregates';
import { OrganizationId } from '../value-objects';

export interface OrganizationRepository {
  save(organization: Organization): Promise<void>;
  findById(id: OrganizationId): Promise<Organization | null>;
}
