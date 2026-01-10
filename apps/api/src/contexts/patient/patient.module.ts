import { Module } from '@nestjs/common';
import { DomainEventPublisher, PrismaService } from 'src/shared';
import {
  ArchivePatientHandler,
  CreatePatientHandler,
  InvitePatientHandler,
  RegisterPatientUserHandler,
} from './application/commands';
import { PatientRepository } from './domain/repositories';
import { PatientController } from './infraestructure/http';
import { PrismaPatientRepository } from './infraestructure/repositories';
import { NoopDomainEventPublisher } from './infraestructure/services';
import { DOMAIN_EVENT_PUBLISHER, PATIENT_REPOSITORY } from './patient.tokens';

@Module({
  controllers: [PatientController],
  providers: [
    PrismaService,
    {
      provide: PATIENT_REPOSITORY,
      useFactory: (prisma: PrismaService) =>
        new PrismaPatientRepository(prisma),
      inject: [PrismaService],
    },
    { provide: DOMAIN_EVENT_PUBLISHER, useClass: NoopDomainEventPublisher },
    {
      provide: CreatePatientHandler,
      useFactory: (
        patients: PatientRepository,
        publisher: DomainEventPublisher,
      ) => new CreatePatientHandler(patients, publisher),
      inject: [PATIENT_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: InvitePatientHandler,
      useFactory: (
        patients: PatientRepository,
        publisher: DomainEventPublisher,
      ) => new InvitePatientHandler(patients, publisher),
      inject: [PATIENT_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: RegisterPatientUserHandler,
      useFactory: (
        patients: PatientRepository,
        publisher: DomainEventPublisher,
      ) => new RegisterPatientUserHandler(patients, publisher),
      inject: [PATIENT_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
    {
      provide: ArchivePatientHandler,
      useFactory: (
        patients: PatientRepository,
        publisher: DomainEventPublisher,
      ) => new ArchivePatientHandler(patients, publisher),
      inject: [PATIENT_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
  ],
})
export class PatientModule {}
