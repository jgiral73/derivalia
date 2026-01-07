import { UserNotFoundError } from '../../../domain/errors/DomainErrors';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UserId } from '../../../domain/value-objects/UserId';
import { DomainEventPublisher } from '../../services/DomainEventPublisher';
import { DisableAccountCommand } from './DisableAccountCommand';

export class DisableAccountHandler {
  constructor(
    private readonly users: UserRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: DisableAccountCommand): Promise<void> {
    const userId = UserId.fromString(command.userId);
    const user = await this.users.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    user.disable(command.reason);

    await this.users.save(user);
    await this.eventPublisher.publish(user.pullDomainEvents());
  }
}
