import { DomainEventPublisher } from 'src/shared';
import { UserNotFoundError } from '../../../domain/errors';
import { UserRepository } from '../../../domain/repositories';
import { UserId } from '../../../domain/value-objects';
import { DisableAccountCommand } from '.';



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
