import { TimeSlot } from './TimeSlot';
import { InvalidTimeSlotError } from '../errors';

describe('TimeSlot', () => {
  it('creates with valid range', () => {
    const slot = TimeSlot.create(
      new Date('2026-01-01T10:00:00.000Z'),
      new Date('2026-01-01T11:00:00.000Z'),
    );

    expect(slot.startAt).toBeInstanceOf(Date);
    expect(slot.endAt).toBeInstanceOf(Date);
  });

  it('rejects invalid range', () => {
    expect(() =>
      TimeSlot.create(
        new Date('2026-01-01T11:00:00.000Z'),
        new Date('2026-01-01T10:00:00.000Z'),
      ),
    ).toThrow(InvalidTimeSlotError);
  });
});
