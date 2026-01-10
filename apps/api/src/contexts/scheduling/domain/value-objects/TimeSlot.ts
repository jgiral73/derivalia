import { InvalidTimeSlotError } from '../errors';

export class TimeSlot {
  private constructor(
    public readonly startAt: Date,
    public readonly endAt: Date,
  ) {}

  static create(startAt: Date, endAt: Date): TimeSlot {
    if (endAt <= startAt) {
      throw new InvalidTimeSlotError();
    }
    return new TimeSlot(startAt, endAt);
  }

  overlaps(other: TimeSlot): boolean {
    return this.startAt < other.endAt && other.startAt < this.endAt;
  }
}
