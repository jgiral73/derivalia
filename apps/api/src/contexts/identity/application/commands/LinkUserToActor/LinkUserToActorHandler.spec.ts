import { DomainEventPublisher, Email } from 'src/shared';

import { LinkUserToActorHandler } from './LinkUserToActorHandler';
import { LinkUserToActorCommand } from './LinkUserToActorCommand';
import { RoleNotFoundError, UserNotFoundError } from '../../../domain/errors';
import { RoleRepository, UserRepository } from '../../../domain/repositories';
import { User } from '../../../domain/aggregates';
import { Role } from '../../../domain/entities';
import {
  PasswordHash,
  PermissionCode,
  PermissionSet,
  RoleName,
  UserId,
} from '../../../domain/value-objects';

const buildUser = () =>
  User.register(
    UserId.fromString('user-1'),
    Email.create('user@derivalia.com'),
    PasswordHash.fromHashed('hashed'),
  );

const buildRole = () =>
  new Role(
    'role-1',
    RoleName.create('PROFESSIONAL'),
    new PermissionSet([PermissionCode.create('patient.create')]),
  );

const buildDeps = () => {
  const users: UserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };
  const roles: RoleRepository = {
    findByName: jest.fn(),
    findById: jest.fn(),
  };
  const publisher: DomainEventPublisher = {
    // eslint-disable-next-line @typescript-eslint/require-await
    publish: jest.fn(async () => undefined),
  };

  return { users, roles, publisher };
};

describe('LinkUserToActorHandler', () => {
  it('throws when user is missing', async () => {
    const { users, roles, publisher } = buildDeps();
    (users.findById as jest.Mock).mockResolvedValue(null);

    const handler = new LinkUserToActorHandler(users, roles, publisher);

    await expect(
      handler.execute(
        new LinkUserToActorCommand(
          'user-1',
          'actor-1',
          'professional',
          'PROFESSIONAL',
        ),
      ),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('throws when role is missing', async () => {
    const { users, roles, publisher } = buildDeps();
    (users.findById as jest.Mock).mockResolvedValue(buildUser());
    (roles.findByName as jest.Mock).mockResolvedValue(null);

    const handler = new LinkUserToActorHandler(users, roles, publisher);

    await expect(
      handler.execute(
        new LinkUserToActorCommand(
          'user-1',
          'actor-1',
          'professional',
          'PROFESSIONAL',
        ),
      ),
    ).rejects.toThrow(RoleNotFoundError);
  });

  it('saves and publishes on success', async () => {
    const { users, roles, publisher } = buildDeps();
    (users.findById as jest.Mock).mockResolvedValue(buildUser());
    (roles.findByName as jest.Mock).mockResolvedValue(buildRole());

    const handler = new LinkUserToActorHandler(users, roles, publisher);

    await handler.execute(
      new LinkUserToActorCommand(
        'user-1',
        'actor-1',
        'professional',
        'PROFESSIONAL',
      ),
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(users.save).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
