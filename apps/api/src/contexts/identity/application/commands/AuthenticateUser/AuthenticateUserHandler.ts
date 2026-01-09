import { DomainEventPublisher } from 'src/shared';

import { InvalidCredentialsError } from '../../../domain/errors/DomainErrors';
import { Email } from '../../../domain/value-objects/Email';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { PasswordPolicy } from '../../../domain/services/PasswordPolicy';

import { AuthenticateUserCommand } from './AuthenticateUserCommand';

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
