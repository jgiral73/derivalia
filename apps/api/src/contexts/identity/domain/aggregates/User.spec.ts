import { Email } from 'src/shared';

import { User } from '.';
import { Role } from '../entities';
import {
  ActorReference,
  PasswordHash,
  PermissionCode,
  PermissionSet,
  RoleName,
  UserId,
  UserState,
} from '../value-objects';
import {
  RoleAlreadyAssignedError,
  UserMustBeDisabledToArchiveError,
} from '../errors';

describe('User aggregate', () => {
  const email = Email.create('user@example.com');
  const hash = PasswordHash.fromHashed('hashed');
  const id = UserId.fromString('user-1');

  const buildRole = () =>
    new Role(
      'role-1',
      RoleName.create('PROFESSIONAL'),
      new PermissionSet([PermissionCode.create('patient.create')]),
    );

  it('registers and emits UserRegistered', () => {
    const user = User.register(id, email, hash);
    const events = user.pullDomainEvents();

    expect(events.map((event) => event.eventName)).toEqual(['UserRegistered']);
  });

  it('assigns role and activates when registered', () => {
    const user = User.register(id, email, hash);
    const role = buildRole();

    user.assignRole(role);
    const events = user.pullDomainEvents();

    expect(user.getState().value).toBe(UserState.Active.value);
    expect(events.map((event) => event.eventName)).toEqual([
      'UserRegistered',
      'RoleAssigned',
      'AccountEnabled',
    ]);
  });

  it('prevents assigning the same role twice', () => {
    const user = User.register(id, email, hash);
    const role = buildRole();

    user.assignRole(role);

    expect(() => user.assignRole(role)).toThrow(RoleAlreadyAssignedError);
  });

  it('requires disable before archive', () => {
    const user = User.register(id, email, hash);

    expect(() => user.archive()).toThrow(UserMustBeDisabledToArchiveError);
  });

  it('links to actor once', () => {
    const user = User.register(id, email, hash);
    const reference = ActorReference.create('actor-1', 'professional');

    user.linkToActor(reference);

    expect(user.getActorLinks()).toHaveLength(1);
  });
});
