/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserHandler, LoginUserCommand } from '../../application/commands/LoginUser';
import { AuthenticateUserRequestDto, LoginUserRequestDto } from './dtos';
import { AuthenticateUserCommand, AuthenticateUserHandler } from '../../application/commands/AuthenticateUser';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUser: LoginUserHandler,
    private readonly authenticateUser: AuthenticateUserHandler,
  ) {}

  @Post('login')
  async login(@Body() body: LoginUserRequestDto) {
    return this.loginUser.execute(
      new LoginUserCommand(body.email, body.password),
    );
  }

  @Post('authenticate')
  async authenticate(@Body() body: AuthenticateUserRequestDto) {
    const command = new AuthenticateUserCommand(body.email, body.password);
    await this.authenticateUser.execute(command);
    return { status: 'ok' };
  }
}
