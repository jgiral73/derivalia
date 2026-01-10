import { OrganizationName } from '.';
import { InvalidOrganizationNameError } from '../errors';

describe('OrganizationName', () => {
  it('rejects short names', () => {
    expect(() => OrganizationName.create('A')).toThrow(
      InvalidOrganizationNameError,
    );
  });

  it('trims and keeps valid names', () => {
    const name = OrganizationName.create('  Clinica Derivalia  ');

    expect(name.value).toBe('Clinica Derivalia');
  });
});
