import { InvalidTreatmentPeriodError } from '../errors';

export class TreatmentPeriod {
  private constructor(
    public readonly startAt: Date,
    public readonly endAt: Date | null,
  ) {}

  static startNow(): TreatmentPeriod {
    return new TreatmentPeriod(new Date(), null);
  }

  static fromDates(startAt: Date, endAt: Date | null): TreatmentPeriod {
    if (endAt && endAt < startAt) {
      throw new InvalidTreatmentPeriodError();
    }
    return new TreatmentPeriod(startAt, endAt);
  }

  closeNow(): TreatmentPeriod {
    if (this.endAt) {
      throw new InvalidTreatmentPeriodError();
    }
    return new TreatmentPeriod(this.startAt, new Date());
  }

  isActive(): boolean {
    return this.endAt === null;
  }
}
