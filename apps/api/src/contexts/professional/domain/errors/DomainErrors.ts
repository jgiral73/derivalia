import { DomainError } from 'src/shared';

export class InvalidProfessionalIdError extends DomainError {
  constructor() {
    super('Invalid professional id', 'INVALID_PROFESSIONAL_ID');
  }
}

export class InvalidFullNameError extends DomainError {
  constructor(value: string) {
    super(`Invalid full name: ${value}`, 'INVALID_FULL_NAME');
  }
}

export class InvalidLicenseNumberError extends DomainError {
  constructor(value: string) {
    super(`Invalid license number: ${value}`, 'INVALID_LICENSE_NUMBER');
  }
}

export class InvalidSpecialtyError extends DomainError {
  constructor(value: string) {
    super(`Invalid specialty: ${value}`, 'INVALID_SPECIALTY');
  }
}

export class InvalidProfessionalStatusError extends DomainError {
  constructor(value: string) {
    super(
      `Invalid professional status: ${value}`,
      'INVALID_PROFESSIONAL_STATUS',
    );
  }
}

export class ProfessionalNotFoundError extends DomainError {
  constructor() {
    super('Professional not found', 'PROFESSIONAL_NOT_FOUND');
  }
}

export class ProfessionalAlreadyExistsError extends DomainError {
  constructor() {
    super('Professional already exists', 'PROFESSIONAL_ALREADY_EXISTS');
  }
}

export class ProfessionalStateTransitionNotAllowedError extends DomainError {
  constructor(from: string, to: string) {
    super(
      `Professional state transition not allowed: ${from} -> ${to}`,
      'PROFESSIONAL_STATE_TRANSITION_NOT_ALLOWED',
    );
  }
}

export class ProfessionalSuspendedError extends DomainError {
  constructor() {
    super('Professional is suspended', 'PROFESSIONAL_SUSPENDED');
  }
}
