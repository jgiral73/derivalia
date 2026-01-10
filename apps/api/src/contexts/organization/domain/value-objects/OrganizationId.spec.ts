import { OrganizationId } from '.';
import { InvalidOrganizationIdError } from '../errors';

describe('OrganizationId', () => {
  it('rejects empty ids', () => {
    expect(() => OrganizationId.fromString('')).toThrow(
      InvalidOrganizationIdError,
    );
  });

  it('creates from non-empty string', () => {
    const id = OrganizationId.fromString('org-1');

    expect(id.value).toBe('org-1');
  });
});
