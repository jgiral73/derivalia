import { Specialty } from '.';
import { InvalidSpecialtyError } from '../errors';

describe('Specialty', () => {
  it('normalizes specialty', () => {
    const specialty = Specialty.create('Psychology');

    expect(specialty.value).toBe('psychology');
  });

  it('rejects empty specialty', () => {
    expect(() => Specialty.create('')).toThrow(InvalidSpecialtyError);
  });
});
