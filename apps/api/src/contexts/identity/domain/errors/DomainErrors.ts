import { DomainError } from 'src/shared';

export class InvalidEmailError extends DomainError {
  constructor(value: string) {
    super(`Invalid email: ${value}`, 'INVALID_EMAIL');
  }
}

export class InvalidUserIdError extends DomainError {
  constructor() {
    super('Invalid user id', 'INVALID_USER_ID');
  }
}

export class InvalidRoleNameError extends DomainError {
  constructor(value: string) {
    super(`Invalid role name: ${value}`, 'INVALID_ROLE_NAME');
  }
}

export class InvalidPermissionCodeError extends DomainError {
  constructor(value: string) {
    super(`Invalid permission code: ${value}`, 'INVALID_PERMISSION_CODE');
  }
}

export class InvalidPasswordHashError extends DomainError {
  constructor() {
    super('Invalid password hash', 'INVALID_PASSWORD_HASH');
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor() {
    super('User already exists', 'USER_ALREADY_EXISTS');
  }
}

export class UserNotFoundError extends DomainError {
  constructor() {
    super('User not found', 'USER_NOT_FOUND');
  }
}

export class RoleNotFoundError extends DomainError {
  constructor() {
    super('Role not found', 'ROLE_NOT_FOUND');
  }
}

export class RoleAlreadyAssignedError extends DomainError {
  constructor() {
    super('Role already assigned', 'ROLE_ALREADY_ASSIGNED');
  }
}

export class UserDisabledError extends DomainError {
  constructor() {
    super('User is disabled', 'USER_DISABLED');
  }
}

export class UserArchivedError extends DomainError {
  constructor() {
    super('User is archived', 'USER_ARCHIVED');
  }
}

export class UserStateTransitionNotAllowedError extends DomainError {
  constructor(from: string, to: string) {
    super(
      `User state transition not allowed: ${from} -> ${to}`,
      'USER_STATE_TRANSITION_NOT_ALLOWED',
    );
  }
}

export class InvalidUserStateError extends DomainError {
  constructor(value: string) {
    super(`Invalid user state: ${value}`, 'INVALID_USER_STATE');
  }
}

export class UserCannotActivateWithoutRoleError extends DomainError {
  constructor() {
    super(
      'User cannot be active without at least one role',
      'USER_CANNOT_ACTIVATE_WITHOUT_ROLE',
    );
  }
}

export class ActorAlreadyLinkedError extends DomainError {
  constructor() {
    super('Actor already linked to user', 'ACTOR_ALREADY_LINKED');
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid credentials', 'INVALID_CREDENTIALS');
  }
}

export class UserAlreadyDisabledError extends DomainError {
  constructor() {
    super('User already disabled', 'USER_ALREADY_DISABLED');
  }
}

export class UserAlreadyActiveError extends DomainError {
  constructor() {
    super('User already active', 'USER_ALREADY_ACTIVE');
  }
}

export class UserAlreadyArchivedError extends DomainError {
  constructor() {
    super('User already archived', 'USER_ALREADY_ARCHIVED');
  }
}

export class UserMustBeDisabledToArchiveError extends DomainError {
  constructor() {
    super(
      'User must be disabled before archiving',
      'USER_MUST_BE_DISABLED_TO_ARCHIVE',
    );
  }
}
