import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  CloseTreatmentCommand,
  CloseTreatmentHandler,
  StartTreatmentCommand,
  StartTreatmentHandler,
} from '../../application/commands';
import { JwtAuthGuard } from '../../../identity/infraestructure/auth';
import {
  CloseTreatmentRequestDto,
  StartTreatmentRequestDto,
} from './dtos';

@Controller('treatments')
@UseGuards(JwtAuthGuard)
export class TreatmentController {
  constructor(
    private readonly startTreatment: StartTreatmentHandler,
    private readonly closeTreatment: CloseTreatmentHandler,
  ) {}

  @Post()
  async start(@Body() body: StartTreatmentRequestDto) {
    const command = new StartTreatmentCommand(
      body.patientId,
      body.professionalId,
      body.organizationId ?? null,
      body.goal,
    );
    const treatmentId = await this.startTreatment.execute(command);
    return { treatmentId };
  }

  @Post('close')
  async close(@Body() body: CloseTreatmentRequestDto) {
    const command = new CloseTreatmentCommand(body.treatmentId);
    await this.closeTreatment.execute(command);
    return { status: 'ok' };
  }
}
