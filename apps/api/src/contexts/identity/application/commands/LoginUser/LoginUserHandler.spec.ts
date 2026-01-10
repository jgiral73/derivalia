import { DomainEventPublisher, Email } from 'src/shared';

import { LoginUserHandler } from './LoginUserHandler';
import { LoginUserCommand } from './LoginUserCommand';
import { InvalidCredentialsError } from '../../../domain/errors';
import { PasswordPolicy } from '../../../domain/services';
import { UserRepository } from '../../../domain/repositories';
import { User } from '../../../domain/aggregates';
import { PasswordHash, UserId } from '../../../domain/value-objects';
import { JwtService } from '../../../infraestructure/auth/JwtService';

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
    // eslint-disable-next-line @typescript-eslint/require-await
    verify: jest.fn(async () => true),
  };
  const jwtService: JwtService = {
    sign: jest.fn(() => 'token'),
    verify: jest.fn(),
  } as unknown as JwtService;
  const publisher: DomainEventPublisher = {
    // eslint-disable-next-line @typescript-eslint/require-await
    publish: jest.fn(async () => undefined),
  };

  return { users, passwordPolicy, jwtService, publisher };
};

describe('LoginUserHandler', () => {
  it('throws on invalid credentials', async () => {
    const { users, passwordPolicy, jwtService, publisher } = buildDeps();
    (users.findByEmail as jest.Mock).mockResolvedValue(null);

    const handler = new LoginUserHandler(
      users,
      passwordPolicy,
      jwtService,
      publisher,
    );

    await expect(
      handler.execute(new LoginUserCommand('user@derivalia.com', 'pass')),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('returns token on success', async () => {
    const { users, passwordPolicy, jwtService, publisher } = buildDeps();
    (users.findByEmail as jest.Mock).mockResolvedValue(buildUser());

    const handler = new LoginUserHandler(
      users,
      passwordPolicy,
      jwtService,
      publisher,
    );

    const result = await handler.execute(
      new LoginUserCommand('user@derivalia.com', 'pass'),
    );

    expect(result.accessToken).toBe('token');
  });
});
