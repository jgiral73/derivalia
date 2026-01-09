import { DomainEventPublisher } from 'src/shared';
import { UserNotFoundError } from '../../../domain/errors';
import { UserRepository } from '../../../domain/repositories';
import { UserId } from '../../../domain/value-objects';
import { EnableAccountCommand } from '.';



export class EnableAccountHandler {
  constructor(
    private readonly users: UserRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: EnableAccountCommand): Promise<void> {
    const userId = UserId.fromString(command.userId);
    const user = await this.users.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    user.enable();

    await this.users.save(user);
    await this.eventPublisher.publish(user.pullDomainEvents());
  }
}
