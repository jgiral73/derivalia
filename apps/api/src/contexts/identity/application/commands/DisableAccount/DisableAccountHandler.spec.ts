import { DomainEventPublisher, Email } from 'src/shared';

import { DisableAccountHandler } from './DisableAccountHandler';
import { DisableAccountCommand } from './DisableAccountCommand';
import { UserNotFoundError } from '../../../domain/errors';
import { UserRepository } from '../../../domain/repositories';
import { User } from '../../../domain/aggregates';
import { PasswordHash, UserId } from '../../../domain/value-objects';

const buildUser = () =>
  User.register(
    UserId.fromString('user-1'),
    Email.create('user@derivalia.com'),
    PasswordHash.fromHashed('hashed'),
  );

const buildDeps = () => {
  const users: UserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };
  const publisher: DomainEventPublisher = {
    publish: jest.fn(async () => undefined),
  };

  return { users, publisher };
};

describe('DisableAccountHandler', () => {
  it('throws when user is missing', async () => {
    const { users, publisher } = buildDeps();
    (users.findById as jest.Mock).mockResolvedValue(null);

    const handler = new DisableAccountHandler(users, publisher);

    await expect(
      handler.execute(new DisableAccountCommand('user-1', 'reason')),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('saves and publishes on success', async () => {
    const { users, publisher } = buildDeps();
    (users.findById as jest.Mock).mockResolvedValue(buildUser());

    const handler = new DisableAccountHandler(users, publisher);

    await handler.execute(new DisableAccountCommand('user-1', 'reason'));

    expect(users.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
