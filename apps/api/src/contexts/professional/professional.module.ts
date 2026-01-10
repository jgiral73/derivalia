import { Module } from '@nestjs/common';
import { DomainEventPublisher, PrismaService } from 'src/shared';
import {
  CompleteProfessionalOnboardingHandler,
  CreateProfessionalHandler,
  InviteProfessionalHandler,
  SuspendProfessionalHandler,
  UpdateProfessionalProfileHandler,
} from './application/commands';
import { ProfessionalRepository } from './domain/repositories';
import { ProfessionalController } from './infraestructure/http';
import { PrismaProfessionalRepository } from './infraestructure/repositories';
import { NoopDomainEventPublisher } from './infraestructure/services';
import {
  DOMAIN_EVENT_PUBLISHER,
  PROFESSIONAL_REPOSITORY,
} from './professional.tokens';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [IdentityModule],
  controllers: [ProfessionalController],
  providers: [
    PrismaService,
    {
      provide: PROFESSIONAL_REPOSITORY,
      useFactory: (prisma: PrismaService) =>
        new PrismaProfessionalRepository(prisma),
      inject: [PrismaService],
    },
    { provide: DOMAIN_EVENT_PUBLISHER, useClass: NoopDomainEventPublisher },
    {
      provide: CreateProfessionalHandler,
      useFactory: (
        professionals: ProfessionalRepository,
        publisher: DomainEventPublisher,
      ) => new CreateProfessionalHandler(professionals, publisher),
      inject: [PROFESSIONAL_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: InviteProfessionalHandler,
      useFactory: (
        professionals: ProfessionalRepository,
        publisher: DomainEventPublisher,
      ) => new InviteProfessionalHandler(professionals, publisher),
      inject: [PROFESSIONAL_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: CompleteProfessionalOnboardingHandler,
      useFactory: (
        professionals: ProfessionalRepository,
        publisher: DomainEventPublisher,
      ) => new CompleteProfessionalOnboardingHandler(professionals, publisher),
      inject: [PROFESSIONAL_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: UpdateProfessionalProfileHandler,
      useFactory: (
        professionals: ProfessionalRepository,
        publisher: DomainEventPublisher,
      ) => new UpdateProfessionalProfileHandler(professionals, publisher),
      inject: [PROFESSIONAL_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: SuspendProfessionalHandler,
      useFactory: (
        professionals: ProfessionalRepository,
        publisher: DomainEventPublisher,
      ) => new SuspendProfessionalHandler(professionals, publisher),
      inject: [PROFESSIONAL_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
  ],
})
export class ProfessionalModule {}
