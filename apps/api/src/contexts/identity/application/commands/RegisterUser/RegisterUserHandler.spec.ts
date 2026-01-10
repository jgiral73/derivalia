import { RegisterUserHandler } from './RegisterUserHandler';
import { RegisterUserCommand } from './RegisterUserCommand';
import { UserAlreadyExistsError } from '../../../domain/errors';
import { PasswordHash } from '../../../domain/value-objects';
import { DomainEventPublisher } from 'src/shared';
import { PasswordPolicy } from '../../../domain/services';
import { UserRepository } from '../../../domain/repositories';

const buildDeps = () => {
  const users: UserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };
  const passwordPolicy: PasswordPolicy = {
    // eslint-disable-next-line @typescript-eslint/require-await
    hash: jest.fn(async () => PasswordHash.fromHashed('hashed')),
    verify: jest.fn(),
  };
  const publisher: DomainEventPublisher = {
    // eslint-disable-next-line @typescript-eslint/require-await
    publish: jest.fn(async () => undefined),
  };

  return { users, passwordPolicy, publisher };
};

describe('RegisterUserHandler', () => {
  it('throws when user already exists', async () => {
    const { users, passwordPolicy, publisher } = buildDeps();
    (users.findByEmail as jest.Mock).mockResolvedValue({});

    const handler = new RegisterUserHandler(users, passwordPolicy, publisher);

    await expect(
      handler.execute(new RegisterUserCommand('test@derivalia.com', 'pass')),
    ).rejects.toThrow(UserAlreadyExistsError);
  });

  it('saves user and publishes events', async () => {
    const { users, passwordPolicy, publisher } = buildDeps();
    (users.findByEmail as jest.Mock).mockResolvedValue(null);

    const handler = new RegisterUserHandler(users, passwordPolicy, publisher);

    await handler.execute(
      new RegisterUserCommand('test@derivalia.com', 'pass'),
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(users.save).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
