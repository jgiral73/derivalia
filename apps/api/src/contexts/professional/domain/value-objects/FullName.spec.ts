import { FullName } from '.';
import { InvalidFullNameError } from '../errors';

describe('FullName', () => {
  it('creates a trimmed name', () => {
    const name = FullName.create('  Maria Soler  ');

    expect(name.value).toBe('Maria Soler');
  });

  it('rejects short name', () => {
    expect(() => FullName.create('Al')).toThrow(InvalidFullNameError);
  });
});
