import {
  InvalidUserStateError,
  UserCannotActivateWithoutRoleError,
  UserStateTransitionNotAllowedError,
} from '../errors';

export type UserStateValue = 'registered' | 'active' | 'disabled' | 'archived';

export class UserState {
  static Registered = new UserState('registered');
  static Active = new UserState('active');
  static Disabled = new UserState('disabled');
  static Archived = new UserState('archived');

  private constructor(public readonly value: UserStateValue) {}

  static fromValue(value: string): UserState {
    switch (value) {
      case 'registered':
        return UserState.Registered;
      case 'active':
        return UserState.Active;
      case 'disabled':
        return UserState.Disabled;
      case 'archived':
        return UserState.Archived;
      default:
        throw new InvalidUserStateError(value);
    }
  }

  canTransitionTo(next: UserState): boolean {
    const allowed: Record<UserStateValue, UserStateValue[]> = {
      registered: ['active', 'disabled'],
      active: ['disabled'],
      disabled: ['active', 'archived'],
      archived: [],
    };

    return allowed[this.value].includes(next.value);
  }

  transitionTo(next: UserState): UserState {
    if (!this.canTransitionTo(next)) {
      throw new UserStateTransitionNotAllowedError(this.value, next.value);
    }
    return next;
  }

  ensureCanActivate(hasRole: boolean): void {
    if (!hasRole) {
      throw new UserCannotActivateWithoutRoleError();
    }
  }
}
