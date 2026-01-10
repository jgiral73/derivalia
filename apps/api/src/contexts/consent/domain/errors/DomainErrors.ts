import { DomainError } from 'src/shared';

export class InvalidConsentIdError extends DomainError {
  constructor() {
    super('Invalid consent id', 'INVALID_CONSENT_ID');
  }
}

export class InvalidConsentScopeError extends DomainError {
  constructor(value: string) {
    super(`Invalid consent scope: ${value}`, 'INVALID_CONSENT_SCOPE');
  }
}

export class InvalidConsentPurposeError extends DomainError {
  constructor(value: string) {
    super(`Invalid consent purpose: ${value}`, 'INVALID_CONSENT_PURPOSE');
  }
}

export class InvalidConsentDecisionError extends DomainError {
  constructor(value: string) {
    super(`Invalid consent decision: ${value}`, 'INVALID_CONSENT_DECISION');
  }
}

export class ConsentNotFoundError extends DomainError {
  constructor() {
    super('Consent not found', 'CONSENT_NOT_FOUND');
  }
}

export class ConsentAlreadyGrantedError extends DomainError {
  constructor() {
    super('Consent already granted', 'CONSENT_ALREADY_GRANTED');
  }
}

export class ConsentAlreadyRevokedError extends DomainError {
  constructor() {
    super('Consent already revoked', 'CONSENT_ALREADY_REVOKED');
  }
}

export class InvalidConformityTypeError extends DomainError {
  constructor(value: string) {
    super(`Invalid conformity type: ${value}`, 'INVALID_CONFORMITY_TYPE');
  }
}

export class InvalidConformityStatusError extends DomainError {
  constructor(value: string) {
    super(`Invalid conformity status: ${value}`, 'INVALID_CONFORMITY_STATUS');
  }
}

export class ConformityNotFoundError extends DomainError {
  constructor() {
    super('Conformity not found', 'CONFORMITY_NOT_FOUND');
  }
}

export class ConformityAlreadyDecidedError extends DomainError {
  constructor() {
    super('Conformity already decided', 'CONFORMITY_ALREADY_DECIDED');
  }
}
