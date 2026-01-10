import { DomainEventPublisher } from 'src/shared';
import { UserRepository } from '../../../domain/repositories';
import { UserId } from '../../../domain/value-objects';
import { UserNotFoundError } from '../../../domain/errors';

import { ArchiveAccountCommand } from '.';

export class ArchiveAccountHandler {
  constructor(
    private readonly users: UserRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: ArchiveAccountCommand): Promise<void> {
    const userId = UserId.fromString(command.userId);
    const user = await this.users.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    user.archive();

    await this.users.save(user);
    await this.eventPublisher.publish(user.pullDomainEvents());
  }
}
