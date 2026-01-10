import { PatientStateTransitionNotAllowedError } from '../errors';

export type PatientStatusValue =
  | 'created_by_professional'
  | 'invited'
  | 'active'
  | 'archived';

export class PatientStatus {
  static CreatedByProfessional = new PatientStatus('created_by_professional');
  static Invited = new PatientStatus('invited');
  static Active = new PatientStatus('active');
  static Archived = new PatientStatus('archived');

  private constructor(public readonly value: PatientStatusValue) {}

  static fromValue(value: string): PatientStatus {
    switch (value) {
      case 'created_by_professional':
        return PatientStatus.CreatedByProfessional;
      case 'invited':
        return PatientStatus.Invited;
      case 'active':
        return PatientStatus.Active;
      case 'archived':
        return PatientStatus.Archived;
      default:
        throw new PatientStateTransitionNotAllowedError(value, value);
    }
  }

  canTransitionTo(next: PatientStatus): boolean {
    const allowed: Record<PatientStatusValue, PatientStatusValue[]> = {
      created_by_professional: ['invited', 'archived'],
      invited: ['active', 'archived'],
      active: ['archived'],
      archived: [],
    };

    return allowed[this.value].includes(next.value);
  }

  transitionTo(next: PatientStatus): PatientStatus {
    if (!this.canTransitionTo(next)) {
      throw new PatientStateTransitionNotAllowedError(this.value, next.value);
    }

    return next;
  }
}
