import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ArchivePatientCommand,
  ArchivePatientHandler,
} from '../../application/commands/ArchivePatient';
import {
  CreatePatientCommand,
  CreatePatientHandler,
} from '../../application/commands/CreatePatient';
import {
  InvitePatientCommand,
  InvitePatientHandler,
} from '../../application/commands/InvitePatient';
import {
  RegisterPatientUserCommand,
  RegisterPatientUserHandler,
} from '../../application/commands/RegisterPatientUser';
import {
  ArchivePatientRequestDto,
  CreatePatientRequestDto,
  InvitePatientRequestDto,
  RegisterPatientUserRequestDto,
} from './dtos';
import { JwtAuthGuard } from '../../../identity/infraestructure/auth';
import { USER_REPOSITORY } from '../../../identity/identity.tokens';
import { UserNotFoundError } from '../../../identity/domain/errors';
import { type UserRepository } from '../../../identity/domain/repositories';
import { UserId } from '../../../identity/domain/value-objects';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    private readonly createPatient: CreatePatientHandler,
    private readonly invitePatient: InvitePatientHandler,
    private readonly registerPatientUser: RegisterPatientUserHandler,
    private readonly archivePatient: ArchivePatientHandler,
  ) {}

  @Post()
  async create(@Body() body: CreatePatientRequestDto) {
    const command = new CreatePatientCommand(
      body.professionalId,
      body.fullName,
      body.birthDate,
      body.email,
      body.phone,
    );

    await this.createPatient.execute(command);
    return { status: 'ok' };
  }

  @Post('invite')
  async invite(@Body() body: InvitePatientRequestDto) {
    const command = new InvitePatientCommand(
      body.patientId,
      body.email,
      body.phone,
    );
    await this.invitePatient.execute(command);
    return { status: 'ok' };
  }

  @Post('register-user')
  async registerUser(@Body() body: RegisterPatientUserRequestDto) {
    const user = await this.users.findById(UserId.fromString(body.userId));
    if (!user) {
      throw new UserNotFoundError();
    }

    const command = new RegisterPatientUserCommand(body.patientId, body.userId);
    await this.registerPatientUser.execute(command);
    return { status: 'ok' };
  }

  @Post('archive')
  async archive(@Body() body: ArchivePatientRequestDto) {
    const command = new ArchivePatientCommand(body.patientId);
    await this.archivePatient.execute(command);
    return { status: 'ok' };
  }
}
