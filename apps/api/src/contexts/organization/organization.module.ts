import { Module } from '@nestjs/common';
import { DomainEventPublisher, PrismaService } from 'src/shared';
import {
  ActivateOrganizationHandler,
  CreateOrganizationHandler,
  SuspendOrganizationHandler,
} from './application/commands';
import { OrganizationRepository } from './domain/repositories';
import { OrganizationController } from './infraestructure/http';
import { PrismaOrganizationRepository } from './infraestructure/repositories';
import { NoopDomainEventPublisher } from './infraestructure/services';
import {
  DOMAIN_EVENT_PUBLISHER,
  ORGANIZATION_REPOSITORY,
} from './organization.tokens';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [IdentityModule],
  controllers: [OrganizationController],
  providers: [
    PrismaService,
    {
      provide: ORGANIZATION_REPOSITORY,
      useFactory: (prisma: PrismaService) =>
        new PrismaOrganizationRepository(prisma),
      inject: [PrismaService],
    },
    { provide: DOMAIN_EVENT_PUBLISHER, useClass: NoopDomainEventPublisher },
    {
      provide: CreateOrganizationHandler,
      useFactory: (
        organizations: OrganizationRepository,
        publisher: DomainEventPublisher,
      ) => new CreateOrganizationHandler(organizations, publisher),
      inject: [ORGANIZATION_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: ActivateOrganizationHandler,
      useFactory: (
        organizations: OrganizationRepository,
        publisher: DomainEventPublisher,
      ) => new ActivateOrganizationHandler(organizations, publisher),
      inject: [ORGANIZATION_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: SuspendOrganizationHandler,
      useFactory: (
        organizations: OrganizationRepository,
        publisher: DomainEventPublisher,
      ) => new SuspendOrganizationHandler(organizations, publisher),
      inject: [ORGANIZATION_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
  ],
})
export class OrganizationModule {}
