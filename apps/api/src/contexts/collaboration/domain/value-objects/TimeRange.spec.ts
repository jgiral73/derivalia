import { TimeRange } from '.';
import { InvalidTimeRangeError } from '../errors';

describe('TimeRange', () => {
  it('rejects when end is before start', () => {
    expect(() =>
      TimeRange.create(new Date('2026-01-10'), new Date('2026-01-01')),
    ).toThrow(InvalidTimeRangeError);
  });

  it('creates valid range', () => {
    const range = TimeRange.create(
      new Date('2026-01-01'),
      new Date('2026-02-01'),
    );

    expect(range.from).toEqual(new Date('2026-01-01'));
  });
});
