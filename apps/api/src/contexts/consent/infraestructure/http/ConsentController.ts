import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  AcceptConformityCommand,
  AcceptConformityHandler,
  GrantConsentCommand,
  GrantConsentHandler,
  RejectConformityCommand,
  RejectConformityHandler,
  RequestConsentCommand,
  RequestConsentHandler,
  RequestConformityCommand,
  RequestConformityHandler,
  RevokeConsentCommand,
  RevokeConsentHandler,
} from '../../application/commands';
import { JwtAuthGuard } from '../../../identity/infraestructure/auth';
import {
  AcceptConformityRequestDto,
  GrantConsentRequestDto,
  RejectConformityRequestDto,
  RequestConsentRequestDto,
  RequestConformityRequestDto,
  RevokeConsentRequestDto,
} from './dtos';

@Controller('consents')
@UseGuards(JwtAuthGuard)
export class ConsentController {
  constructor(
    private readonly requestConsent: RequestConsentHandler,
    private readonly grantConsent: GrantConsentHandler,
    private readonly revokeConsent: RevokeConsentHandler,
    private readonly requestConformity: RequestConformityHandler,
    private readonly acceptConformity: AcceptConformityHandler,
    private readonly rejectConformity: RejectConformityHandler,
  ) {}

  @Post('request')
  async request(@Body() body: RequestConsentRequestDto) {
    const command = new RequestConsentCommand(
      body.patientId,
      body.granteeId,
      body.scopeType,
      body.scopeRef,
      body.purpose,
      body.validUntil ? new Date(body.validUntil) : null,
    );
    const consentId = await this.requestConsent.execute(command);
    return { consentId };
  }

  @Post('grant')
  async grant(@Body() body: GrantConsentRequestDto) {
    const command = new GrantConsentCommand(
      body.consentId,
      body.validUntil ? new Date(body.validUntil) : null,
    );
    await this.grantConsent.execute(command);
    return { status: 'ok' };
  }

  @Post('revoke')
  async revoke(@Body() body: RevokeConsentRequestDto) {
    const command = new RevokeConsentCommand(body.consentId);
    await this.revokeConsent.execute(command);
    return { status: 'ok' };
  }

  @Post('conformity/request')
  async requestConform(@Body() body: RequestConformityRequestDto) {
    const command = new RequestConformityCommand(body.consentId, body.type);
    const conformityId = await this.requestConformity.execute(command);
    return { conformityId };
  }

  @Post('conformity/accept')
  async accept(@Body() body: AcceptConformityRequestDto) {
    const command = new AcceptConformityCommand(
      body.consentId,
      body.conformityId,
    );
    await this.acceptConformity.execute(command);
    return { status: 'ok' };
  }

  @Post('conformity/reject')
  async reject(@Body() body: RejectConformityRequestDto) {
    const command = new RejectConformityCommand(
      body.consentId,
      body.conformityId,
    );
    await this.rejectConformity.execute(command);
    return { status: 'ok' };
  }
}
