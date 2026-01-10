import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ActivateOrganizationCommand,
  ActivateOrganizationHandler,
  CreateOrganizationCommand,
  CreateOrganizationHandler,
  SuspendOrganizationCommand,
  SuspendOrganizationHandler,
} from '../../application/commands';
import { JwtAuthGuard } from '../../../identity/infraestructure/auth';
import {
  ActivateOrganizationRequestDto,
  CreateOrganizationRequestDto,
  SuspendOrganizationRequestDto,
} from './dtos';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationController {
  constructor(
    private readonly createOrganization: CreateOrganizationHandler,
    private readonly activateOrganization: ActivateOrganizationHandler,
    private readonly suspendOrganization: SuspendOrganizationHandler,
  ) {}

  @Post()
  async create(@Body() body: CreateOrganizationRequestDto) {
    const command = new CreateOrganizationCommand(
      body.ownerUserId,
      body.name,
      body.type,
    );
    const organizationId = await this.createOrganization.execute(command);
    return { organizationId };
  }

  @Post('activate')
  async activate(@Body() body: ActivateOrganizationRequestDto) {
    const command = new ActivateOrganizationCommand(body.organizationId);
    await this.activateOrganization.execute(command);
    return { status: 'ok' };
  }

  @Post('suspend')
  async suspend(@Body() body: SuspendOrganizationRequestDto) {
    const command = new SuspendOrganizationCommand(body.organizationId);
    await this.suspendOrganization.execute(command);
    return { status: 'ok' };
  }
}
