import { InvalidTreatmentGoalError } from '../errors';

export class TreatmentGoal {
  private constructor(public readonly value: string) {}

  static create(value: string): TreatmentGoal {
    const normalized = value.trim();
    if (!normalized) {
      throw new InvalidTreatmentGoalError(value);
    }
    return new TreatmentGoal(normalized);
  }
}
