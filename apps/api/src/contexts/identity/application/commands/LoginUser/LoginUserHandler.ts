import { DomainEventPublisher, Email } from 'src/shared';

import { UserRepository } from '../../../domain/repositories';
import { PasswordPolicy } from '../../../domain/services';
import { InvalidCredentialsError } from '../../../domain/errors';
import { JwtService } from '../../../infraestructure/auth';

import { LoginUserCommand, LoginResult } from '.';

export class LoginUserHandler {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordPolicy: PasswordPolicy,
    private readonly jwtService: JwtService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginResult> {
    const email = Email.create(command.email);
    const user = await this.users.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = await this.passwordPolicy.verify(
      command.password,
      user.getPasswordHash(),
    );

    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    user.authenticate();
    await this.eventPublisher.publish(user.pullDomainEvents());

    const token = this.jwtService.sign({
      sub: user.id.value,
      email: user.email.value,
    });

    return new LoginResult(token);
  }
}
