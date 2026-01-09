import { Module } from '@nestjs/common';
import { DomainEventPublisher, PrismaService } from 'src/shared';
import { AuthController, IdentityController } from './infraestructure/http';
import { JwtAuthGuard, JwtService } from './infraestructure/auth';
import {
  PrismaRoleRepository,
  PrismaUserRepository,
} from './infraestructure/repositories';
import {
  NoopDomainEventPublisher,
  NodePasswordPolicy,
} from './infraestructure/services';
import { AuthenticateUserHandler } from './application/commands/AuthenticateUser';
import { LinkUserToActorHandler } from './application/commands/LinkUserToActor';
import { LoginUserHandler } from './application/commands/LoginUser';
import { RegisterUserHandler } from './application/commands/RegisterUser';
import { RoleRepository, UserRepository } from './domain/repositories';
import { PasswordPolicy } from './domain/services';
import {
  DOMAIN_EVENT_PUBLISHER,
  PASSWORD_POLICY,
  ROLE_REPOSITORY,
  USER_REPOSITORY,
} from './identity.tokens';

@Module({
  controllers: [IdentityController, AuthController],
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
    JwtService,
    JwtAuthGuard,
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
      provide: LoginUserHandler,
      useFactory: (
        users: UserRepository,
        policy: PasswordPolicy,
        jwtService: JwtService,
        publisher: DomainEventPublisher,
      ) => new LoginUserHandler(users, policy, jwtService, publisher),
      inject: [
        USER_REPOSITORY,
        PASSWORD_POLICY,
        JwtService,
        DOMAIN_EVENT_PUBLISHER,
      ],
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
  exports: [JwtService, JwtAuthGuard],
})
export class IdentityModule {}
