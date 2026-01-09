import { Body, Controller, Post } from '@nestjs/common';

import { AuthenticateUserHandler } from '../../application/commands/AuthenticateUser/AuthenticateUserHandler';
import { AuthenticateUserCommand } from '../../application/commands/AuthenticateUser/AuthenticateUserCommand';
import { RegisterUserHandler } from '../../application/commands/RegisterUser/RegisterUserHandler';
import { RegisterUserCommand } from '../../application/commands/RegisterUser/RegisterUserCommand';
import { LinkUserToActorHandler } from '../../application/commands/LinkUserToActor/LinkUserToActorHandler';
import { LinkUserToActorCommand } from '../../application/commands/LinkUserToActor/LinkUserToActorCommand';
import { AuthenticateUserRequestDto } from './dtos/AuthenticateUserRequestDto';
import { LinkUserToActorRequestDto } from './dtos/LinkUserToActorRequestDto';
import { RegisterUserRequestDto } from './dtos/RegisterUserRequestDto';

@Controller('identity')
export class IdentityController {
  constructor(
    private readonly registerUser: RegisterUserHandler,
    private readonly authenticateUser: AuthenticateUserHandler,
    private readonly linkUserToActor: LinkUserToActorHandler,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterUserRequestDto) {
    const command = new RegisterUserCommand(body.email, body.password);
    await this.registerUser.execute(command);
    return { status: 'ok' };
  }

  @Post('authenticate')
  async authenticate(@Body() body: AuthenticateUserRequestDto) {
    const command = new AuthenticateUserCommand(body.email, body.password);
    await this.authenticateUser.execute(command);
    return { status: 'ok' };
  }

  @Post('link-actor')
  async linkActor(@Body() body: LinkUserToActorRequestDto) {
    const command = new LinkUserToActorCommand(
      body.userId,
      body.actorId,
      body.actorType,
      body.roleName,
    );
    await this.linkUserToActor.execute(command);
    return { status: 'ok' };
  }
}
