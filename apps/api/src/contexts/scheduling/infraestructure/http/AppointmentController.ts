import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';

import {
  CancelAppointmentCommand,
  CancelAppointmentHandler,
  CreateAvailabilityCommand,
  CreateAvailabilityHandler,
  RescheduleAppointmentCommand,
  RescheduleAppointmentHandler,
  ScheduleAppointmentCommand,
  ScheduleAppointmentHandler,
} from '../../application/commands';
import { JwtAuthGuard } from '../../../identity/infraestructure/auth';
import { PatientNotFoundError } from '../../../patient/domain/errors';
import type { PatientRepository } from '../../../patient/domain/repositories';
import { PatientId } from '../../../patient/domain/value-objects';
import { PATIENT_REPOSITORY } from '../../../patient/patient.tokens';
import { ProfessionalNotFoundError } from '../../../professional/domain/errors';
import type { ProfessionalRepository } from '../../../professional/domain/repositories';
import { ProfessionalId } from '../../../professional/domain/value-objects';
import { PROFESSIONAL_REPOSITORY } from '../../../professional/professional.tokens';
import {
  CancelAppointmentRequestDto,
  CreateAvailabilityRequestDto,
  RescheduleAppointmentRequestDto,
  ScheduleAppointmentRequestDto,
} from './dtos';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(
    private readonly createAvailability: CreateAvailabilityHandler,
    private readonly scheduleAppointment: ScheduleAppointmentHandler,
    private readonly rescheduleAppointment: RescheduleAppointmentHandler,
    private readonly cancelAppointment: CancelAppointmentHandler,
    @Inject(PATIENT_REPOSITORY)
    private readonly patients: PatientRepository,
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionals: ProfessionalRepository,
  ) {}

  @Post('slots')
  async createSlot(@Body() body: CreateAvailabilityRequestDto) {
    await this.ensureProfessionalExists(body.professionalId);
    const command = new CreateAvailabilityCommand(
      body.professionalId,
      new Date(body.startAt),
      new Date(body.endAt),
      body.slotType,
    );
    const slotId = await this.createAvailability.execute(command);
    return { slotId };
  }

  @Post()
  async schedule(@Body() body: ScheduleAppointmentRequestDto) {
    await this.ensureProfessionalExists(body.professionalId);
    if (body.patientId) {
      await this.ensurePatientExists(body.patientId);
    }
    const command = new ScheduleAppointmentCommand(
      body.professionalId,
      body.patientId ?? null,
      body.organizationId ?? null,
      body.treatmentId ?? null,
      new Date(body.startAt),
      new Date(body.endAt),
      body.type,
    );
    const appointmentId = await this.scheduleAppointment.execute(command);
    return { appointmentId };
  }

  @Post('reschedule')
  async reschedule(@Body() body: RescheduleAppointmentRequestDto) {
    const command = new RescheduleAppointmentCommand(
      body.appointmentId,
      new Date(body.startAt),
      new Date(body.endAt),
    );
    const appointmentId = await this.rescheduleAppointment.execute(command);
    return { appointmentId };
  }

  @Post('cancel')
  async cancel(@Body() body: CancelAppointmentRequestDto) {
    const command = new CancelAppointmentCommand(body.appointmentId);
    await this.cancelAppointment.execute(command);
    return { status: 'ok' };
  }

  private async ensureProfessionalExists(
    professionalId: string,
  ): Promise<void> {
    const id = ProfessionalId.fromString(professionalId);
    const professional = await this.professionals.findById(id);
    if (!professional) {
      throw new ProfessionalNotFoundError();
    }
  }

  private async ensurePatientExists(patientId: string): Promise<void> {
    const id = PatientId.fromString(patientId);
    const patient = await this.patients.findById(id);
    if (!patient) {
      throw new PatientNotFoundError();
    }
  }
}
