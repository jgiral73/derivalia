import { Prisma, PrismaClient } from '@prisma/client';

import { Email } from 'src/shared';

import { UserRepository } from '../../domain/repositories';
import { User } from '../../domain/aggregates';
import { UserId } from '../../domain/value-objects';
import { UserMapper, PrismaUserWithRelations } from '../mappers';

const userInclude: Prisma.UserInclude = {
  roles: {
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  },
  actorLinks: true,
};

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: Email): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: {
        email: email.value,
      },
      include: userInclude,
    });

    if (!record) {
      return null;
    }

    return UserMapper.toDomain(record as unknown as PrismaUserWithRelations);
  }

  async findById(id: UserId): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: {
        id: id.value,
      },
      include: userInclude,
    });

    if (!record) {
      return null;
    }

    return UserMapper.toDomain(record as unknown as PrismaUserWithRelations);
  }

  async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.upsert({
        where: {
          id: data.user.id,
        },
        update: {
          email: data.user.email,
          passwordHash: data.user.passwordHash,
          state: data.user.state,
        },
        create: {
          id: data.user.id,
          email: data.user.email,
          passwordHash: data.user.passwordHash,
          state: data.user.state,
        },
      });

      await tx.userRole.deleteMany({
        where: {
          userId: data.user.id,
        },
      });

      if (data.roleLinks.length > 0) {
        await tx.userRole.createMany({
          data: data.roleLinks,
          skipDuplicates: true,
        });
      }

      await tx.userActorLink.deleteMany({
        where: {
          userId: data.user.id,
        },
      });

      if (data.actorLinks.length > 0) {
        await tx.userActorLink.createMany({
          data: data.actorLinks,
          skipDuplicates: true,
        });
      }
    });
  }
}
