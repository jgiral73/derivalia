import { PrismaService } from 'src/shared';
import { Organization } from '../../domain/aggregates';
import { OrganizationRepository } from '../../domain/repositories';
import { OrganizationId } from '../../domain/value-objects';
import { OrganizationMapper } from '../mappers';

export class PrismaOrganizationRepository implements OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(organization: Organization): Promise<void> {
    const data = OrganizationMapper.toPersistence(organization);

    await this.prisma.organization.upsert({
      where: {
        id: data.id,
      },
      update: {
        name: data.name,
        type: data.type,
        status: data.status,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        ownerUserId: data.ownerUserId,
        name: data.name,
        type: data.type,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: OrganizationId): Promise<Organization | null> {
    const record = await this.prisma.organization.findUnique({
      where: {
        id: id.value,
      },
    });

    if (!record) {
      return null;
    }

    return OrganizationMapper.toDomain(record);
  }
}
