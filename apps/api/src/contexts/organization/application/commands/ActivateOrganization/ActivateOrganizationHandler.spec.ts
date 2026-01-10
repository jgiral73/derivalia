import { ActivateOrganizationHandler } from './ActivateOrganizationHandler';
import { ActivateOrganizationCommand } from './ActivateOrganizationCommand';
import { OrganizationNotFoundError } from '../../../domain/errors';
import { OrganizationRepository } from '../../../domain/repositories';
import { DomainEventPublisher } from 'src/shared';
import { Organization } from '../../../domain/aggregates';
import {
  OrganizationId,
  OrganizationName,
  OrganizationStatus,
  OrganizationType,
} from '../../../domain/value-objects';

const buildDeps = () => {
  const organizations: OrganizationRepository = {
    save: jest.fn(),
    findById: jest.fn(),
  };
  const publisher: DomainEventPublisher = {
    publish: jest.fn(async () => undefined),
  };

  return { organizations, publisher };
};

const buildOrganization = () =>
  Organization.rehydrate({
    id: OrganizationId.fromString('org-1'),
    ownerUserId: 'user-1',
    name: OrganizationName.create('Clinic One'),
    type: OrganizationType.Clinic,
    status: OrganizationStatus.Draft,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

describe('ActivateOrganizationHandler', () => {
  it('throws when organization does not exist', async () => {
    const { organizations, publisher } = buildDeps();
    (organizations.findById as jest.Mock).mockResolvedValue(null);

    const handler = new ActivateOrganizationHandler(organizations, publisher);

    await expect(
      handler.execute(new ActivateOrganizationCommand('org-1')),
    ).rejects.toThrow(OrganizationNotFoundError);
  });

  it('saves and publishes events', async () => {
    const { organizations, publisher } = buildDeps();
    (organizations.findById as jest.Mock).mockResolvedValue(buildOrganization());

    const handler = new ActivateOrganizationHandler(organizations, publisher);

    await handler.execute(new ActivateOrganizationCommand('org-1'));

    expect(organizations.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
