import { OrganizationType } from '.';
import { InvalidOrganizationTypeError } from '../errors';

describe('OrganizationType', () => {
  it('builds from valid values', () => {
    const type = OrganizationType.fromValue('clinic');

    expect(type.value).toBe('clinic');
  });

  it('rejects invalid values', () => {
    expect(() => OrganizationType.fromValue('ngo')).toThrow(
      InvalidOrganizationTypeError,
    );
  });
});
