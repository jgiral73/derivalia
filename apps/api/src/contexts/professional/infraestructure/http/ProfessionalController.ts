import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import {
  CompleteProfessionalOnboardingCommand,
  CompleteProfessionalOnboardingHandler,
} from '../../application/commands/CompleteProfessionalOnboarding';
import {
  CreateProfessionalCommand,
  CreateProfessionalHandler,
} from '../../application/commands/CreateProfessional';
import {
  InviteProfessionalCommand,
  InviteProfessionalHandler,
} from '../../application/commands/InviteProfessional';
import {
  SuspendProfessionalCommand,
  SuspendProfessionalHandler,
} from '../../application/commands/SuspendProfessional';
import {
  UpdateProfessionalProfileCommand,
  UpdateProfessionalProfileHandler,
} from '../../application/commands/UpdateProfessionalProfile';
import { JwtAuthGuard } from '../../../identity/infraestructure/auth';
import { USER_REPOSITORY } from '../../../identity/identity.tokens';
import { UserNotFoundError } from '../../../identity/domain/errors';
import { type UserRepository } from '../../../identity/domain/repositories';
import { UserId } from '../../../identity/domain/value-objects';
import {
  CompleteProfessionalOnboardingRequestDto,
  CreateProfessionalRequestDto,
  InviteProfessionalRequestDto,
  SuspendProfessionalRequestDto,
  UpdateProfessionalProfileRequestDto,
} from './dtos';

@Controller('professionals')
@UseGuards(JwtAuthGuard)
export class ProfessionalController {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    private readonly createProfessional: CreateProfessionalHandler,
    private readonly inviteProfessional: InviteProfessionalHandler,
    private readonly completeOnboarding: CompleteProfessionalOnboardingHandler,
    private readonly updateProfile: UpdateProfessionalProfileHandler,
    private readonly suspendProfessional: SuspendProfessionalHandler,
  ) {}

  @Post()
  async create(@Body() body: CreateProfessionalRequestDto) {
    const command = new CreateProfessionalCommand(body.userId, body.email);
    const user = await this.users.findById(UserId.fromString(body.userId));
    if (!user) {
      throw new UserNotFoundError();
    }
    await this.createProfessional.execute(command);
    return { status: 'ok' };
  }

  @Post('invite')
  async invite(@Body() body: InviteProfessionalRequestDto) {
    const command = new InviteProfessionalCommand(body.email);
    await this.inviteProfessional.execute(command);
    return { status: 'ok' };
  }

  @Post('complete-onboarding')
  async complete(@Body() body: CompleteProfessionalOnboardingRequestDto) {
    const command = new CompleteProfessionalOnboardingCommand(
      body.professionalId,
      body.fullName,
      body.licenseNumber,
      body.specialties,
    );
    await this.completeOnboarding.execute(command);
    return { status: 'ok' };
  }

  @Post('update-profile')
  async update(@Body() body: UpdateProfessionalProfileRequestDto) {
    const command = new UpdateProfessionalProfileCommand(
      body.professionalId,
      body.fullName,
      body.licenseNumber,
      body.specialties,
    );
    await this.updateProfile.execute(command);
    return { status: 'ok' };
  }

  @Post('suspend')
  async suspend(@Body() body: SuspendProfessionalRequestDto) {
    const command = new SuspendProfessionalCommand(
      body.professionalId,
      body.reason,
    );
    await this.suspendProfessional.execute(command);
    return { status: 'ok' };
  }
}
