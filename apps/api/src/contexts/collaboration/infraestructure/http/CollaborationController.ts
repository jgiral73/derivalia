import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import {
  AcceptCollaborationCommand,
  AcceptCollaborationHandler,
  EndCollaborationCommand,
  EndCollaborationHandler,
  RejectCollaborationCommand,
  RejectCollaborationHandler,
  RequestCollaborationCommand,
  RequestCollaborationHandler,
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
  AcceptCollaborationRequestDto,
  EndCollaborationRequestDto,
  RejectCollaborationRequestDto,
  RequestCollaborationRequestDto,
} from './dtos';

@Controller('collaborations')
@UseGuards(JwtAuthGuard)
export class CollaborationController {
  constructor(
    private readonly requestCollaboration: RequestCollaborationHandler,
    private readonly acceptCollaboration: AcceptCollaborationHandler,
    private readonly rejectCollaboration: RejectCollaborationHandler,
    private readonly endCollaboration: EndCollaborationHandler,
    @Inject(PATIENT_REPOSITORY)
    private readonly patients: PatientRepository,
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionals: ProfessionalRepository,
  ) {}

  @Post('request')
  async request(@Body() body: RequestCollaborationRequestDto) {
    await this.ensureProfessionalExists(body.requesterProfessionalId);
    await this.ensurePatientExists(body.patientId);
    if (body.collaboratorProfessionalId) {
      await this.ensureProfessionalExists(body.collaboratorProfessionalId);
    }
    const command = new RequestCollaborationCommand(
      body.requesterProfessionalId,
      body.patientId,
      body.purposeSpecialty,
      body.purposeDescription,
      body.scopeCanViewClinicalRecords,
      body.scopeCanAddNotes,
      body.scopeCanSuggestTreatment,
      body.scopeCanAccessForms,
      new Date(body.periodFrom),
      body.periodTo ? new Date(body.periodTo) : undefined,
      body.collaboratorProfessionalId,
      body.collaboratorEmail,
      body.treatmentId,
    );

    const collaborationId = await this.requestCollaboration.execute(command);
    return { collaborationId };
  }

  @Post('accept')
  async accept(@Body() body: AcceptCollaborationRequestDto) {
    await this.ensureProfessionalExists(body.collaboratorProfessionalId);
    const command = new AcceptCollaborationCommand(
      body.collaborationId,
      body.collaboratorProfessionalId,
    );
    await this.acceptCollaboration.execute(command);
    return { status: 'ok' };
  }

  @Post('reject')
  async reject(@Body() body: RejectCollaborationRequestDto) {
    await this.ensureProfessionalExists(body.collaboratorProfessionalId);
    const command = new RejectCollaborationCommand(
      body.collaborationId,
      body.collaboratorProfessionalId,
    );
    await this.rejectCollaboration.execute(command);
    return { status: 'ok' };
  }

  @Post('end')
  async end(@Body() body: EndCollaborationRequestDto) {
    if (body.endedByProfessionalId) {
      await this.ensureProfessionalExists(body.endedByProfessionalId);
    }
    const command = new EndCollaborationCommand(
      body.collaborationId,
      body.endedByProfessionalId,
    );
    await this.endCollaboration.execute(command);
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
