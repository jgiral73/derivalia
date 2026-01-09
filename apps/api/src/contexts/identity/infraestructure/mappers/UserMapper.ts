/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IdentityUserState, Prisma } from '@prisma/client';
import { User } from '../../domain/aggregates';
import { Role } from '../../domain/entities';
import {
  ActorReference,
  ActorType,
  Email,
  PasswordHash,
  PermissionCode,
  PermissionSet,
  RoleName,
  UserId,
  UserState,
} from '../../domain/value-objects';

export type PrismaUserWithRelations = Prisma.UserGetPayload<{
  include: {
    roles: {
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true;
              };
            };
          };
        };
      };
    };
    actorLinks: true;
  };
}>;

export class UserMapper {
  static toDomain(raw: PrismaUserWithRelations): User {
    const roles = raw.roles.map((userRole) => {
      const permissionCodes = userRole.role.permissions.map((rolePermission) =>
        PermissionCode.create(rolePermission.permission.code),
      );

      return new Role(
        userRole.role.id,
        RoleName.create(userRole.role.name),
        new PermissionSet(permissionCodes),
      );
    });

    const actorLinks = raw.actorLinks.map((link) =>
      ActorReference.create(link.actorId, link.actorType as ActorType),
    );

    return new User(
      UserId.fromString(raw.id),
      Email.create(raw.email),
      PasswordHash.fromHashed(raw.passwordHash),
      roles,
      actorLinks,
      UserState.fromValue(raw.state),
    );
  }

  static toPersistence(user: User): {
    user: {
      id: string;
      email: string;
      passwordHash: string;
      state: IdentityUserState;
    };
    roleLinks: { userId: string; roleId: string }[];
    actorLinks: { userId: string; actorId: string; actorType: string }[];
  } {
    const roleLinks = user.getRoles().map((role) => ({
      userId: user.id.value,
      roleId: role.id,
    }));

    const actorLinks = user.getActorLinks().map((link) => ({
      userId: user.id.value,
      actorId: link.actorId,
      actorType: link.actorType,
    }));

    return {
      user: {
        id: user.id.value,
        email: user.email.value,
        passwordHash: user.getPasswordHash().value,
        state: user.getState().value as IdentityUserState,
      },
      roleLinks,
      actorLinks,
    };
  }
}
