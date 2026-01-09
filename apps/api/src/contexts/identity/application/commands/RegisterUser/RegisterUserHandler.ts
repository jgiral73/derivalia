import { randomUUID } from 'crypto';

import { DomainEventPublisher } from 'src/shared';
import { User } from '../../../domain/aggregates';
import { UserAlreadyExistsError } from '../../../domain/errors';
import { Email, UserId } from '../../../domain/value-objects';
import { UserRepository } from '../../../domain/repositories';
import { PasswordPolicy } from '../../../domain/services';
import { RegisterUserCommand } from '.';



export class RegisterUserHandler {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordPolicy: PasswordPolicy,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const email = Email.create(command.email);
    const existing = await this.users.findByEmail(email);

    if (existing) {
      throw new UserAlreadyExistsError();
    }

    const hash = await this.passwordPolicy.hash(command.plainPassword);
    const user = User.register(UserId.fromString(randomUUID()), email, hash);

    await this.users.save(user);
    await this.eventPublisher.publish(user.pullDomainEvents());
  }
}
