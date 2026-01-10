import { DomainError } from 'src/shared';

export class InvalidOrganizationIdError extends DomainError {
  constructor() {
    super('Invalid organization id', 'INVALID_ORGANIZATION_ID');
  }
}

export class InvalidOrganizationNameError extends DomainError {
  constructor(value: string) {
    super(`Invalid organization name: ${value}`, 'INVALID_ORGANIZATION_NAME');
  }
}

export class InvalidOrganizationTypeError extends DomainError {
  constructor(value: string) {
    super(`Invalid organization type: ${value}`, 'INVALID_ORGANIZATION_TYPE');
  }
}

export class InvalidOrganizationStatusError extends DomainError {
  constructor(value: string) {
    super(`Invalid organization status: ${value}`, 'INVALID_ORGANIZATION_STATUS');
  }
}

export class OrganizationNotFoundError extends DomainError {
  constructor() {
    super('Organization not found', 'ORGANIZATION_NOT_FOUND');
  }
}

export class OrganizationStateTransitionNotAllowedError extends DomainError {
  constructor(from: string, to: string) {
    super(
      `Organization state transition not allowed: ${from} -> ${to}`,
      'ORGANIZATION_STATE_TRANSITION_NOT_ALLOWED',
    );
  }
}
