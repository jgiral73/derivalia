import { DomainError } from 'src/shared';

export class InvalidTreatmentIdError extends DomainError {
  constructor() {
    super('Invalid treatment id', 'INVALID_TREATMENT_ID');
  }
}

export class InvalidTreatmentGoalError extends DomainError {
  constructor(value: string) {
    super(`Invalid treatment goal: ${value}`, 'INVALID_TREATMENT_GOAL');
  }
}

export class InvalidTreatmentPeriodError extends DomainError {
  constructor() {
    super('Invalid treatment period', 'INVALID_TREATMENT_PERIOD');
  }
}

export class TreatmentNotFoundError extends DomainError {
  constructor() {
    super('Treatment not found', 'TREATMENT_NOT_FOUND');
  }
}

export class TreatmentAlreadyClosedError extends DomainError {
  constructor() {
    super('Treatment already closed', 'TREATMENT_ALREADY_CLOSED');
  }
}
