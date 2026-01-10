import { Module } from '@nestjs/common';
import { DomainEventPublisher, PrismaService } from 'src/shared';
import {
  CloseTreatmentHandler,
  StartTreatmentHandler,
} from './application/commands';
import { TreatmentRepository } from './domain/repositories';
import { TreatmentController } from './infraestructure/http';
import { PrismaTreatmentRepository } from './infraestructure/repositories';
import { NoopDomainEventPublisher } from './infraestructure/services';
import {
  DOMAIN_EVENT_PUBLISHER,
  TREATMENT_REPOSITORY,
} from './treatment.tokens';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [IdentityModule],
  controllers: [TreatmentController],
  providers: [
    PrismaService,
    {
      provide: TREATMENT_REPOSITORY,
      useFactory: (prisma: PrismaService) =>
        new PrismaTreatmentRepository(prisma),
      inject: [PrismaService],
    },
    { provide: DOMAIN_EVENT_PUBLISHER, useClass: NoopDomainEventPublisher },
    {
      provide: StartTreatmentHandler,
      useFactory: (
        treatments: TreatmentRepository,
        publisher: DomainEventPublisher,
      ) => new StartTreatmentHandler(treatments, publisher),
      inject: [TREATMENT_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: CloseTreatmentHandler,
      useFactory: (
        treatments: TreatmentRepository,
        publisher: DomainEventPublisher,
      ) => new CloseTreatmentHandler(treatments, publisher),
      inject: [TREATMENT_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
  ],
})
export class TreatmentModule {}
