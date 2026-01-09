/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserHandler, RegisterUserCommand } from '../../application/commands/RegisterUser';
import { LinkUserToActorHandler, LinkUserToActorCommand } from '../../application/commands/LinkUserToActor';
import { LinkUserToActorRequestDto, RegisterUserRequestDto } from './dtos';

@Controller('identity')
export class IdentityController {
  constructor(
    private readonly registerUser: RegisterUserHandler,
    private readonly linkUserToActor: LinkUserToActorHandler,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterUserRequestDto) {
    const command = new RegisterUserCommand(body.email, body.password);
    await this.registerUser.execute(command);
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
