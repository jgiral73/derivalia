import { DomainEventPublisher, Email } from 'src/shared';

import { ArchiveAccountHandler } from './ArchiveAccountHandler';
import { ArchiveAccountCommand } from './ArchiveAccountCommand';
import { UserNotFoundError } from '../../../domain/errors';
import { UserRepository } from '../../../domain/repositories';
import { User } from '../../../domain/aggregates';
import { PasswordHash, UserId } from '../../../domain/value-objects';

const buildUser = () => {
  const user = User.register(
    UserId.fromString('user-1'),
    Email.create('user@derivalia.com'),
    PasswordHash.fromHashed('hashed'),
  );
  user.disable();
  return user;
};

const buildDeps = () => {
  const users: UserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };
  const publisher: DomainEventPublisher = {
    // eslint-disable-next-line @typescript-eslint/require-await
    publish: jest.fn(async () => undefined),
  };

  return { users, publisher };
};

describe('ArchiveAccountHandler', () => {
  it('throws when user is missing', async () => {
    const { users, publisher } = buildDeps();
    (users.findById as jest.Mock).mockResolvedValue(null);

    const handler = new ArchiveAccountHandler(users, publisher);

    await expect(
      handler.execute(new ArchiveAccountCommand('user-1')),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('saves and publishes on success', async () => {
    const { users, publisher } = buildDeps();
    (users.findById as jest.Mock).mockResolvedValue(buildUser());

    const handler = new ArchiveAccountHandler(users, publisher);

    await handler.execute(new ArchiveAccountCommand('user-1'));

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(users.save).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
