import { OrganizationStatus } from '.';
import { OrganizationStateTransitionNotAllowedError } from '../errors';

describe('OrganizationStatus', () => {
  it('allows draft to active', () => {
    const next = OrganizationStatus.Draft.transitionTo(
      OrganizationStatus.Active,
    );

    expect(next.value).toBe('active');
  });

  it('allows active to suspended', () => {
    const next = OrganizationStatus.Active.transitionTo(
      OrganizationStatus.Suspended,
    );

    expect(next.value).toBe('suspended');
  });

  it('rejects invalid transitions', () => {
    expect(() =>
      OrganizationStatus.Suspended.transitionTo(OrganizationStatus.Active),
    ).toThrow(OrganizationStateTransitionNotAllowedError);
  });
});
