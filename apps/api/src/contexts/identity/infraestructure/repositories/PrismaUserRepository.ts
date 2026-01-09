import { PrismaClient } from '@prisma/client';

import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/aggregates/User';
import { Email } from '../../domain/value-objects/Email';
import { UserId } from '../../domain/value-objects/UserId';
import { Role } from '../../domain/entities/Role';
import { ActorReference } from '../../domain/value-objects/ActorReference';
import { UserState } from '../../domain/value-objects/UserState';
import { PasswordHash } from '../../domain/value-objects/PasswordHash';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: Email): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    if (!record) return null;

    // const { id, passwordHash } = record;
    const roles: Role[] = [];
    const actorLinks: ActorReference[] = [];
    const state: UserState = UserState.Registered;

    return new User(record.id, record.email, record.passwordHash, roles, actorLinks, state);
  }

  async findById(id: UserId): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } })
    if (!record) return null;

    const email: Email = Email.create(record.email);
    const passwordHash = PasswordHash.fromHashed(record.passwordHash);
    const roles: Role[] = [...record.roles];
    const actorLinks: ActorReference[] = [...record.actorLinks];
    const state: UserState = record.state;

    return new User(id, email, passwordHash, roles, actorLinks, state);
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        // createdAt: user.createdAt
      },
    });
    return Promise.resolve();
  }
}