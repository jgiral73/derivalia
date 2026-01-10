import { BirthDate } from '.';
import { InvalidBirthDateError } from '../errors';

describe('BirthDate', () => {
  it('creates a valid birth date', () => {
    const date = new Date('2000-01-01');
    const birthDate = BirthDate.fromDate(date);

    expect(birthDate.value).toBe(date);
  });

  it('rejects future dates', () => {
    const future = new Date();
    future.setDate(future.getDate() + 1);

    expect(() => BirthDate.fromDate(future)).toThrow(InvalidBirthDateError);
  });
});
