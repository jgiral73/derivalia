import { Module } from '@nestjs/common';
import { DomainEventPublisher, PrismaService } from 'src/shared';
import {
  CancelAppointmentHandler,
  CreateAvailabilityHandler,
  RescheduleAppointmentHandler,
  ScheduleAppointmentHandler,
} from './application/commands';
import { ConsentChecker } from './application/ports/ConsentChecker';
import { AppointmentRepository, SlotRepository } from './domain/repositories';
import { AvailabilityPolicy } from './domain/services';
import { ConsentModule } from '../consent/consent.module';
import { IdentityModule } from '../identity/identity.module';
import { ConsentService } from '../consent/application/services';
import { PatientModule } from '../patient/patient.module';
import { ProfessionalModule } from '../professional/professional.module';
import { AppointmentController } from './infraestructure/http';
import { ConsentCheckerAdapter } from './infraestructure/adapters/ConsentCheckerAdapter';
import {
  PrismaAppointmentRepository,
  PrismaSlotRepository,
} from './infraestructure/repositories';
import { NoopDomainEventPublisher } from './infraestructure/services';
import {
  APPOINTMENT_REPOSITORY,
  CONSENT_CHECKER,
  DOMAIN_EVENT_PUBLISHER,
  SLOT_REPOSITORY,
} from './scheduling.tokens';

@Module({
  imports: [ConsentModule, IdentityModule, PatientModule, ProfessionalModule],
  controllers: [AppointmentController],
  providers: [
    PrismaService,
    {
      provide: APPOINTMENT_REPOSITORY,
      useFactory: (prisma: PrismaService) =>
        new PrismaAppointmentRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: SLOT_REPOSITORY,
      useFactory: (prisma: PrismaService) => new PrismaSlotRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: AvailabilityPolicy,
      useFactory: (
        appointments: AppointmentRepository,
        slots: SlotRepository,
      ) => new AvailabilityPolicy(appointments, slots),
      inject: [APPOINTMENT_REPOSITORY, SLOT_REPOSITORY],
    },
    {
      provide: CONSENT_CHECKER,
      useFactory: (consentService: ConsentService): ConsentChecker =>
        new ConsentCheckerAdapter(consentService),
      inject: [ConsentService],
    },
    { provide: DOMAIN_EVENT_PUBLISHER, useClass: NoopDomainEventPublisher },
    {
      provide: CreateAvailabilityHandler,
      useFactory: (slots: SlotRepository, availability: AvailabilityPolicy) =>
        new CreateAvailabilityHandler(slots, availability),
      inject: [SLOT_REPOSITORY, AvailabilityPolicy],
    },
    {
      provide: ScheduleAppointmentHandler,
      useFactory: (
        appointments: AppointmentRepository,
        availability: AvailabilityPolicy,
        consentChecker: ConsentChecker,
        publisher: DomainEventPublisher,
      ) =>
        new ScheduleAppointmentHandler(
          appointments,
          availability,
          consentChecker,
          publisher,
        ),
      inject: [
        APPOINTMENT_REPOSITORY,
        AvailabilityPolicy,
        CONSENT_CHECKER,
        DOMAIN_EVENT_PUBLISHER,
      ],
    },
    {
      provide: RescheduleAppointmentHandler,
      useFactory: (
        appointments: AppointmentRepository,
        availability: AvailabilityPolicy,
        publisher: DomainEventPublisher,
      ) =>
        new RescheduleAppointmentHandler(appointments, availability, publisher),
      inject: [
        APPOINTMENT_REPOSITORY,
        AvailabilityPolicy,
        DOMAIN_EVENT_PUBLISHER,
      ],
    },
    {
      provide: CancelAppointmentHandler,
      useFactory: (
        appointments: AppointmentRepository,
        publisher: DomainEventPublisher,
      ) => new CancelAppointmentHandler(appointments, publisher),
      inject: [APPOINTMENT_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
    },
  ],
})
export class SchedulingModule {}
