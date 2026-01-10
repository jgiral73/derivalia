import { DomainError } from 'src/shared';

export class InvalidPatientIdError extends DomainError {
  constructor() {
    super('Invalid patient id', 'INVALID_PATIENT_ID');
  }
}

export class InvalidPatientNameError extends DomainError {
  constructor(value: string) {
    super(`Invalid patient name: ${value}`, 'INVALID_PATIENT_NAME');
  }
}

export class InvalidBirthDateError extends DomainError {
  constructor() {
    super('Invalid birth date', 'INVALID_BIRTH_DATE');
  }
}

export class InvalidContactInfoError extends DomainError {
  constructor() {
    super('Invalid contact info', 'INVALID_CONTACT_INFO');
  }
}

export class PatientNotFoundError extends DomainError {
  constructor() {
    super('Patient not found', 'PATIENT_NOT_FOUND');
  }
}

export class PatientAlreadyArchivedError extends DomainError {
  constructor() {
    super('Patient already archived', 'PATIENT_ALREADY_ARCHIVED');
  }
}

export class PatientStateTransitionNotAllowedError extends DomainError {
  constructor(from: string, to: string) {
    super(
      `Patient state transition not allowed: ${from} -> ${to}`,
      'PATIENT_STATE_TRANSITION_NOT_ALLOWED',
    );
  }
}
