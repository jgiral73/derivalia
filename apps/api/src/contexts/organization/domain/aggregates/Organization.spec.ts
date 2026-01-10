import { Organization } from '.';
import {
  OrganizationActivated,
  OrganizationCreated,
  OrganizationSuspended,
} from '../events';
import {
  OrganizationId,
  OrganizationName,
  OrganizationType,
} from '../value-objects';

describe('Organization', () => {
  it('emits OrganizationCreated on create', () => {
    const organization = Organization.create({
      id: OrganizationId.fromString('org-1'),
      ownerUserId: 'user-1',
      name: OrganizationName.create('Clinic One'),
      type: OrganizationType.Clinic,
    });

    const events = organization.pullDomainEvents();

    expect(events[0]).toBeInstanceOf(OrganizationCreated);
  });

  it('emits OrganizationActivated when activating', () => {
    const organization = Organization.create({
      id: OrganizationId.fromString('org-1'),
      ownerUserId: 'user-1',
      name: OrganizationName.create('Clinic One'),
      type: OrganizationType.Clinic,
    });
    organization.pullDomainEvents();

    organization.activate();

    const events = organization.pullDomainEvents();

    expect(events[0]).toBeInstanceOf(OrganizationActivated);
  });

  it('emits OrganizationSuspended when suspending', () => {
    const organization = Organization.create({
      id: OrganizationId.fromString('org-1'),
      ownerUserId: 'user-1',
      name: OrganizationName.create('Clinic One'),
      type: OrganizationType.Clinic,
    });
    organization.pullDomainEvents();

    organization.activate();
    organization.pullDomainEvents();

    organization.suspend();

    const events = organization.pullDomainEvents();

    expect(events[0]).toBeInstanceOf(OrganizationSuspended);
  });
});
