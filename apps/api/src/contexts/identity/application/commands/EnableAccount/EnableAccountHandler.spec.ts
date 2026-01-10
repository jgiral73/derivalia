import { EnableAccountHandler } from './EnableAccountHandler';
import { EnableAccountCommand } from './EnableAccountCommand';
import { UserNotFoundError } from '../../../domain/errors';
import { UserRepository } from '../../../domain/repositories';
import { DomainEventPublisher } from 'src/shared';
import { User } from '../../../domain/aggregates';
import { Role } from '../../../domain/entities';
import {
  Email,
  PasswordHash,
  PermissionCode,
  PermissionSet,
  RoleName,
  UserId,
} from '../../../domain/value-objects';

const buildUser = () => {
  const user = User.register(
    UserId.fromString('user-1'),
    Email.create('user@derivalia.com'),
    PasswordHash.fromHashed('hashed'),
  );
  const role = new Role(
    'role-1',
    RoleName.create('PROFESSIONAL'),
    new PermissionSet([PermissionCode.create('patient.create')]),
  );
  user.assignRole(role);
  user.disable('test');
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

describe('EnableAccountHandler', () => {
  it('throws when user is missing', async () => {
    const { users, publisher } = buildDeps();
    (users.findById as jest.Mock).mockResolvedValue(null);

    const handler = new EnableAccountHandler(users, publisher);

    await expect(
      handler.execute(new EnableAccountCommand('user-1')),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('saves and publishes on success', async () => {
    const { users, publisher } = buildDeps();
    (users.findById as jest.Mock).mockResolvedValue(buildUser());

    const handler = new EnableAccountHandler(users, publisher);

    await handler.execute(new EnableAccountCommand('user-1'));

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(users.save).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
