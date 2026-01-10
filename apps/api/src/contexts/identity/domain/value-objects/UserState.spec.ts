import { UserState } from '.';
import {
  UserCannotActivateWithoutRoleError,
  UserStateTransitionNotAllowedError,
} from '../errors';

describe('UserState', () => {
  it('allows valid transitions', () => {
    const next = UserState.Registered.transitionTo(UserState.Active);

    expect(next.value).toBe('active');
  });

  it('rejects invalid transitions', () => {
    expect(() =>
      UserState.Active.transitionTo(UserState.Registered),
    ).toThrow(UserStateTransitionNotAllowedError);
  });

  it('requires role to activate', () => {
    expect(() => UserState.Registered.ensureCanActivate(false)).toThrow(
      UserCannotActivateWithoutRoleError,
    );
  });
});
