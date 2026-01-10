import { AuthenticateUserHandler } from './AuthenticateUserHandler';
import { AuthenticateUserCommand } from './AuthenticateUserCommand';
import { InvalidCredentialsError } from '../../../domain/errors';
import { DomainEventPublisher } from 'src/shared';
import { PasswordPolicy } from '../../../domain/services';
import { UserRepository } from '../../../domain/repositories';
import { User } from '../../../domain/aggregates';
import { Email, PasswordHash, UserId } from '../../../domain/value-objects';

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
  const passwordPolicy: PasswordPolicy = {
    hash: jest.fn(),
    verify: jest.fn(async () => true),
  };
  const publisher: DomainEventPublisher = {
    publish: jest.fn(async () => undefined),
  };

  return { users, passwordPolicy, publisher };
};

describe('AuthenticateUserHandler', () => {
  it('throws on missing user', async () => {
    const { users, passwordPolicy, publisher } = buildDeps();
    (users.findByEmail as jest.Mock).mockResolvedValue(null);

    const handler = new AuthenticateUserHandler(users, passwordPolicy, publisher);

    await expect(
      handler.execute(new AuthenticateUserCommand('user@derivalia.com', 'pass')),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('throws on invalid password', async () => {
    const { users, passwordPolicy, publisher } = buildDeps();
    (users.findByEmail as jest.Mock).mockResolvedValue(buildUser());
    (passwordPolicy.verify as jest.Mock).mockResolvedValue(false);

    const handler = new AuthenticateUserHandler(users, passwordPolicy, publisher);

    await expect(
      handler.execute(new AuthenticateUserCommand('user@derivalia.com', 'pass')),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('publishes events on success', async () => {
    const { users, passwordPolicy, publisher } = buildDeps();
    (users.findByEmail as jest.Mock).mockResolvedValue(buildUser());

    const handler = new AuthenticateUserHandler(users, passwordPolicy, publisher);

    await handler.execute(new AuthenticateUserCommand('user@derivalia.com', 'pass'));

    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
