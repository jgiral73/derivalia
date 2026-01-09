import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared';

import { IdentityController } from './infraestructure/http/IdentityController';
import { NodePasswordPolicy } from './infraestructure/services/NodePasswordPolicy';
import { NoopDomainEventPublisher } from './infraestructure/services/NoopDomainEventPublisher';
import { PrismaUserRepository } from './infraestructure/repositories/PrismaUserRepository';
import { PrismaRoleRepository } from './infraestructure/repositories/PrismaRoleRepository';
import { AuthenticateUserHandler } from './application/commands/AuthenticateUser/AuthenticateUserHandler';
import { RegisterUserHandler } from './application/commands/RegisterUser/RegisterUserHandler';
import { LinkUserToActorHandler } from './application/commands/LinkUserToActor/LinkUserToActorHandler';
import { DomainEventPublisher } from 'src/shared';
import { PasswordPolicy } from './domain/services/PasswordPolicy';
import { RoleRepository } from './domain/repositories/RoleRepository';
import { UserRepository } from './domain/repositories/UserRepository';
import {
  DOMAIN_EVENT_PUBLISHER,
  PASSWORD_POLICY,
  ROLE_REPOSITORY,
  USER_REPOSITORY,
} from './identity.tokens';

@Module({
  controllers: [IdentityController],
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useFactory: (prisma: PrismaService) => new PrismaUserRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: ROLE_REPOSITORY,
      useFactory: (prisma: PrismaService) => new PrismaRoleRepository(prisma),
      inject: [PrismaService],
    },
    { provide: PASSWORD_POLICY, useClass: NodePasswordPolicy },
    { provide: DOMAIN_EVENT_PUBLISHER, useClass: NoopDomainEventPublisher },
    {
      provide: RegisterUserHandler,
      useFactory: (
        users: UserRepository,
        policy: PasswordPolicy,
        publisher: DomainEventPublisher,
      ) => new RegisterUserHandler(users, policy, publisher),
      inject: [USER_REPOSITORY, PASSWORD_POLICY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: AuthenticateUserHandler,
      useFactory: (
        users: UserRepository,
        policy: PasswordPolicy,
        publisher: DomainEventPublisher,
      ) => new AuthenticateUserHandler(users, policy, publisher),
      inject: [USER_REPOSITORY, PASSWORD_POLICY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: LinkUserToActorHandler,
      useFactory: (
        users: UserRepository,
        roles: RoleRepository,
        publisher: DomainEventPublisher,
      ) => new LinkUserToActorHandler(users, roles, publisher),
      inject: [USER_REPOSITORY, ROLE_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
  ],
})
export class IdentityModule {}
