import { Module } from '@nestjs/common';
import { DomainEventPublisher, PrismaService } from 'src/shared';
import {
  AcceptConformityHandler,
  GrantConsentHandler,
  RejectConformityHandler,
  RequestConsentHandler,
  RequestConformityHandler,
  RevokeConsentHandler,
} from './application/commands';
import { ConsentService } from './application/services';
import { ConsentRepository } from './domain/repositories';
import { ConsentController } from './infraestructure/http';
import { PrismaConsentRepository } from './infraestructure/repositories';
import { NoopDomainEventPublisher } from './infraestructure/services';
import { DOMAIN_EVENT_PUBLISHER, CONSENT_REPOSITORY } from './consent.tokens';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [IdentityModule],
  controllers: [ConsentController],
  providers: [
    PrismaService,
    {
      provide: CONSENT_REPOSITORY,
      useFactory: (prisma: PrismaService) =>
        new PrismaConsentRepository(prisma),
      inject: [PrismaService],
    },
    { provide: DOMAIN_EVENT_PUBLISHER, useClass: NoopDomainEventPublisher },
    {
      provide: RequestConsentHandler,
      useFactory: (
        consents: ConsentRepository,
        publisher: DomainEventPublisher,
      ) => new RequestConsentHandler(consents, publisher),
      inject: [CONSENT_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: GrantConsentHandler,
      useFactory: (
        consents: ConsentRepository,
        publisher: DomainEventPublisher,
      ) => new GrantConsentHandler(consents, publisher),
      inject: [CONSENT_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: RevokeConsentHandler,
      useFactory: (
        consents: ConsentRepository,
        publisher: DomainEventPublisher,
      ) => new RevokeConsentHandler(consents, publisher),
      inject: [CONSENT_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: RequestConformityHandler,
      useFactory: (
        consents: ConsentRepository,
        publisher: DomainEventPublisher,
      ) => new RequestConformityHandler(consents, publisher),
      inject: [CONSENT_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: AcceptConformityHandler,
      useFactory: (
        consents: ConsentRepository,
        publisher: DomainEventPublisher,
      ) => new AcceptConformityHandler(consents, publisher),
      inject: [CONSENT_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: RejectConformityHandler,
      useFactory: (
        consents: ConsentRepository,
        publisher: DomainEventPublisher,
      ) => new RejectConformityHandler(consents, publisher),
      inject: [CONSENT_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: ConsentService,
      useFactory: (consents: ConsentRepository) =>
        new ConsentService(consents),
      inject: [CONSENT_REPOSITORY],
    },
  ],
  exports: [ConsentService],
})
export class ConsentModule {}
