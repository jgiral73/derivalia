import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
  ) {}

  @Post('request')
  async request(@Body() body: RequestCollaborationRequestDto) {
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
    const command = new AcceptCollaborationCommand(
      body.collaborationId,
      body.collaboratorProfessionalId,
    );
    await this.acceptCollaboration.execute(command);
    return { status: 'ok' };
  }

  @Post('reject')
  async reject(@Body() body: RejectCollaborationRequestDto) {
    const command = new RejectCollaborationCommand(
      body.collaborationId,
      body.collaboratorProfessionalId,
    );
    await this.rejectCollaboration.execute(command);
    return { status: 'ok' };
  }

  @Post('end')
  async end(@Body() body: EndCollaborationRequestDto) {
    const command = new EndCollaborationCommand(
      body.collaborationId,
      body.endedByProfessionalId,
    );
    await this.endCollaboration.execute(command);
    return { status: 'ok' };
  }
}
