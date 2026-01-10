import { DomainEventPublisher, Email } from 'src/shared';

import { InvalidCredentialsError } from '../../../domain/errors';
import { UserRepository } from '../../../domain/repositories';
import { PasswordPolicy } from '../../../domain/services';

import { AuthenticateUserCommand } from '.';

export class AuthenticateUserHandler {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordPolicy: PasswordPolicy,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: AuthenticateUserCommand): Promise<void> {
    const email = Email.create(command.email);
    const user = await this.users.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const valid = await this.passwordPolicy.verify(
      command.plainPassword,
      user.getPasswordHash(),
    );

    if (!valid) {
      throw new InvalidCredentialsError();
    }

    user.authenticate();
    await this.eventPublisher.publish(user.pullDomainEvents());
  }
}
