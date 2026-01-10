import { Prisma, PrismaClient } from '@prisma/client';
import { Role } from '../../domain/entities';
import { RoleRepository } from '../../domain/repositories';
import {
  PermissionCode,
  PermissionSet,
  RoleName,
} from '../../domain/value-objects';

const roleInclude: Prisma.RoleInclude = {
  permissions: {
    include: {
      permission: true,
    },
  },
};

type PrismaRoleWithPermissions = Prisma.RoleGetPayload<{
  include: {
    permissions: {
      include: {
        permission: true;
      };
    };
  };
}>;

export class PrismaRoleRepository implements RoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByName(name: RoleName): Promise<Role | null> {
    const record = await this.prisma.role.findUnique({
      where: {
        name: name.value,
      },
      include: roleInclude,
    });

    if (!record) {
      return null;
    }

    return PrismaRoleRepository.toDomain(
      record as unknown as PrismaRoleWithPermissions,
    );
  }

  async findById(id: string): Promise<Role | null> {
    const record = await this.prisma.role.findUnique({
      where: {
        id,
      },
      include: roleInclude,
    });

    if (!record) {
      return null;
    }

    return PrismaRoleRepository.toDomain(
      record as unknown as PrismaRoleWithPermissions,
    );
  }

  private static toDomain(raw: PrismaRoleWithPermissions): Role {
    const permissions = raw.permissions.map((rolePermission) =>
      PermissionCode.create(rolePermission.permission.code),
    );

    return new Role(
      raw.id,
      RoleName.create(raw.name),
      new PermissionSet(permissions),
    );
  }
}
