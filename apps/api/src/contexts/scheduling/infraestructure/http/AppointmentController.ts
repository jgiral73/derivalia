import { Body, Controller, Post, UseGuards } from '@nestjs/common';

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
  ) {}

  @Post('slots')
  async createSlot(@Body() body: CreateAvailabilityRequestDto) {
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
}
