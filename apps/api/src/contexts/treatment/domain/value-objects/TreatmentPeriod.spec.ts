import { TreatmentPeriod } from './TreatmentPeriod';
import { InvalidTreatmentPeriodError } from '../errors';

describe('TreatmentPeriod', () => {
  it('starts now and is active', () => {
    const period = TreatmentPeriod.startNow();

    expect(period.isActive()).toBe(true);
  });

  it('closes and sets endAt', () => {
    const period = TreatmentPeriod.startNow();
    const closed = period.closeNow();

    expect(closed.endAt).toBeInstanceOf(Date);
  });

  it('rejects invalid close', () => {
    const period = TreatmentPeriod.startNow();
    const closed = period.closeNow();

    expect(() => closed.closeNow()).toThrow(InvalidTreatmentPeriodError);
  });
});
