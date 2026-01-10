import { TreatmentGoal } from './TreatmentGoal';
import { InvalidTreatmentGoalError } from '../errors';

describe('TreatmentGoal', () => {
  it('creates with valid goal', () => {
    const goal = TreatmentGoal.create('Recovery');

    expect(goal.value).toBe('Recovery');
  });

  it('rejects empty goal', () => {
    expect(() => TreatmentGoal.create('  ')).toThrow(InvalidTreatmentGoalError);
  });
});
