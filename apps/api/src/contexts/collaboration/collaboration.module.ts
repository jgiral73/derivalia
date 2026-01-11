import { Module } from '@nestjs/common';
import { DomainEventPublisher, PrismaService } from 'src/shared';
import {
  AcceptCollaborationHandler,
  EndCollaborationHandler,
  RejectCollaborationHandler,
  RequestCollaborationHandler,
} from './application/commands';
import { CollaborationRepository } from './domain/repositories';
import { CollaborationController } from './infraestructure/http';
import { PrismaCollaborationRepository } from './infraestructure/repositories';
import { NoopDomainEventPublisher } from './infraestructure/services';
import {
  COLLABORATION_REPOSITORY,
  DOMAIN_EVENT_PUBLISHER,
} from './collaboration.tokens';
import { IdentityModule } from '../identity/identity.module';
import { PatientModule } from '../patient/patient.module';
import { ProfessionalModule } from '../professional/professional.module';

@Module({
  imports: [IdentityModule, PatientModule, ProfessionalModule],
  controllers: [CollaborationController],
  providers: [
    PrismaService,
    {
      provide: COLLABORATION_REPOSITORY,
      useFactory: (prisma: PrismaService) =>
        new PrismaCollaborationRepository(prisma),
      inject: [PrismaService],
    },
    { provide: DOMAIN_EVENT_PUBLISHER, useClass: NoopDomainEventPublisher },
    {
      provide: RequestCollaborationHandler,
      useFactory: (
        collaborations: CollaborationRepository,
        publisher: DomainEventPublisher,
      ) => new RequestCollaborationHandler(collaborations, publisher),
      inject: [COLLABORATION_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: AcceptCollaborationHandler,
      useFactory: (
        collaborations: CollaborationRepository,
        publisher: DomainEventPublisher,
      ) => new AcceptCollaborationHandler(collaborations, publisher),
      inject: [COLLABORATION_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: RejectCollaborationHandler,
      useFactory: (
        collaborations: CollaborationRepository,
        publisher: DomainEventPublisher,
      ) => new RejectCollaborationHandler(collaborations, publisher),
      inject: [COLLABORATION_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: EndCollaborationHandler,
      useFactory: (
        collaborations: CollaborationRepository,
        publisher: DomainEventPublisher,
      ) => new EndCollaborationHandler(collaborations, publisher),
      inject: [COLLABORATION_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
  ],
})
export class CollaborationModule {}
