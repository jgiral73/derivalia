import { User } from '../../../domain/aggregates/User';
import { UserAlreadyExistsError } from '../../../domain/errors/DomainErrors';
import { Email } from '../../../domain/value-objects/Email';
import { UserId } from '../../../domain/value-objects/UserId';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { PasswordPolicy } from '../../../domain/services/PasswordPolicy';
import { DomainEventPublisher } from '../../services/DomainEventPublisher';
import { RegisterUserCommand } from './RegisterUserCommand';
import { randomUUID } from 'crypto';

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
