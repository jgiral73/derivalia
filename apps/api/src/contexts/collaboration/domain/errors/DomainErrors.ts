import { DomainError } from 'src/shared';

export class InvalidCollaborationIdError extends DomainError {
  constructor() {
    super('Invalid collaboration id', 'INVALID_COLLABORATION_ID');
  }
}

export class InvalidCollaborationPurposeError extends DomainError {
  constructor(value: string) {
    super(
      `Invalid collaboration purpose specialty: ${value}`,
      'INVALID_COLLABORATION_PURPOSE',
    );
  }
}

export class InvalidCollaborationStatusError extends DomainError {
  constructor(value: string) {
    super(
      `Invalid collaboration status: ${value}`,
      'INVALID_COLLABORATION_STATUS',
    );
  }
}

export class InvalidTimeRangeError extends DomainError {
  constructor() {
    super('Invalid time range', 'INVALID_TIME_RANGE');
  }
}

export class InvalidCollaborationParticipantError extends DomainError {
  constructor() {
    super(
      'Invalid collaboration participant',
      'INVALID_COLLABORATION_PARTICIPANT',
    );
  }
}

export class CollaborationNotFoundError extends DomainError {
  constructor() {
    super('Collaboration not found', 'COLLABORATION_NOT_FOUND');
  }
}

export class CollaborationStateTransitionNotAllowedError extends DomainError {
  constructor(from: string, to: string) {
    super(
      `Collaboration state transition not allowed: ${from} -> ${to}`,
      'COLLABORATION_STATE_TRANSITION_NOT_ALLOWED',
    );
  }
}

export class CollaborationCollaboratorMismatchError extends DomainError {
  constructor() {
    super(
      'Collaboration collaborator does not match',
      'COLLABORATION_COLLABORATOR_MISMATCH',
    );
  }
}
