import { DomainError } from 'src/shared';

export class InvalidAppointmentIdError extends DomainError {
  constructor() {
    super('Invalid appointment id', 'INVALID_APPOINTMENT_ID');
  }
}

export class InvalidSlotIdError extends DomainError {
  constructor() {
    super('Invalid slot id', 'INVALID_SLOT_ID');
  }
}

export class InvalidTimeSlotError extends DomainError {
  constructor() {
    super('Invalid time slot', 'INVALID_TIME_SLOT');
  }
}

export class AppointmentNotFoundError extends DomainError {
  constructor() {
    super('Appointment not found', 'APPOINTMENT_NOT_FOUND');
  }
}

export class AppointmentOverlapError extends DomainError {
  constructor() {
    super('Appointment overlaps with existing slot', 'APPOINTMENT_OVERLAP');
  }
}

export class ConsentRequiredError extends DomainError {
  constructor() {
    super('Active consent required', 'CONSENT_REQUIRED');
  }
}

export class AppointmentStateTransitionNotAllowedError extends DomainError {
  constructor(from: string, to: string) {
    super(
      `Appointment state transition not allowed: ${from} -> ${to}`,
      'APPOINTMENT_STATE_TRANSITION_NOT_ALLOWED',
    );
  }
}

export class SlotTypeNotAllowedError extends DomainError {
  constructor(value: string) {
    super(`Invalid slot type: ${value}`, 'INVALID_SLOT_TYPE');
  }
}
