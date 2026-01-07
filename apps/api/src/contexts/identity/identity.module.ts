import { Module } from '@nestjs/common';
import { IdentityController } from './infraestructure/http/IdentityController';
import { InMemoryRoleRepository } from './infraestructure/repositories/InMemoryRoleRepository';
import { InMemoryUserRepository } from './infraestructure/repositories/InMemoryUserRepository';
import { NodePasswordPolicy } from './infraestructure/services/NodePasswordPolicy';
import { NoopDomainEventPublisher } from './infraestructure/services/NoopDomainEventPublisher';
import { AuthenticateUserHandler } from './application/commands/AuthenticateUser/AuthenticateUserHandler';
import { RegisterUserHandler } from './application/commands/RegisterUser/RegisterUserHandler';
import { LinkUserToActorHandler } from './application/commands/LinkUserToActor/LinkUserToActorHandler';
import {
  DOMAIN_EVENT_PUBLISHER,
  PASSWORD_POLICY,
  ROLE_REPOSITORY,
  USER_REPOSITORY,
} from './identity.tokens';

@Module({
  controllers: [IdentityController],
  providers: [
    { provide: USER_REPOSITORY, useClass: InMemoryUserRepository },
    { provide: ROLE_REPOSITORY, useClass: InMemoryRoleRepository },
    { provide: PASSWORD_POLICY, useClass: NodePasswordPolicy },
    { provide: DOMAIN_EVENT_PUBLISHER, useClass: NoopDomainEventPublisher },
    {
      provide: RegisterUserHandler,
      useFactory: (
        users: InMemoryUserRepository,
        policy: NodePasswordPolicy,
        publisher: NoopDomainEventPublisher,
      ) => new RegisterUserHandler(users, policy, publisher),
      inject: [USER_REPOSITORY, PASSWORD_POLICY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: AuthenticateUserHandler,
      useFactory: (
        users: InMemoryUserRepository,
        policy: NodePasswordPolicy,
        publisher: NoopDomainEventPublisher,
      ) => new AuthenticateUserHandler(users, policy, publisher),
      inject: [USER_REPOSITORY, PASSWORD_POLICY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: LinkUserToActorHandler,
      useFactory: (
        users: InMemoryUserRepository,
        roles: InMemoryRoleRepository,
        publisher: NoopDomainEventPublisher,
      ) => new LinkUserToActorHandler(users, roles, publisher),
      inject: [USER_REPOSITORY, ROLE_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
  ],
})
export class IdentityModule {}
