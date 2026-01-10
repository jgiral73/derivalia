import { InvalidTimeRangeError } from '../errors';

export class TimeRange {
  private constructor(
    public readonly from: Date,
    public readonly to?: Date,
  ) {}

  static create(from: Date, to?: Date): TimeRange {
    if (to && to < from) {
      throw new InvalidTimeRangeError();
    }
    return new TimeRange(from, to);
  }

  isActive(date: Date = new Date()): boolean {
    return this.from <= date && (!this.to || date <= this.to);
  }
}
