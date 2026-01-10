import { Prisma, OrganizationStatus as PrismaOrganizationStatus, OrganizationType as PrismaOrganizationType } from '@prisma/client';
import { Organization } from '../../domain/aggregates';
import {
  OrganizationId,
  OrganizationName,
  OrganizationStatus,
  OrganizationType,
} from '../../domain/value-objects';

export type PrismaOrganization = Prisma.OrganizationGetPayload<object>;

export class OrganizationMapper {
  static toDomain(record: PrismaOrganization): Organization {
    return Organization.rehydrate({
      id: OrganizationId.fromString(record.id),
      ownerUserId: record.ownerUserId,
      name: OrganizationName.create(record.name),
      type: OrganizationType.fromValue(record.type),
      status: OrganizationStatus.fromValue(record.status),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(organization: Organization): {
    id: string;
    ownerUserId: string;
    name: string;
    type: PrismaOrganizationType;
    status: PrismaOrganizationStatus;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: organization.id.value,
      ownerUserId: organization.ownerUserId,
      name: organization.name.value,
      type: organization.type.value as PrismaOrganizationType,
      status: organization.getStatus().value as PrismaOrganizationStatus,
      createdAt: organization.createdAt,
      updatedAt: organization.getUpdatedAt(),
    };
  }
}
