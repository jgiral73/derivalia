import { CreateOrganizationHandler } from './CreateOrganizationHandler';
import { CreateOrganizationCommand } from './CreateOrganizationCommand';
import { OrganizationRepository } from '../../../domain/repositories';
import { DomainEventPublisher } from 'src/shared';

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

describe('CreateOrganizationHandler', () => {
  it('saves and publishes events', async () => {
    const { organizations, publisher } = buildDeps();
    const handler = new CreateOrganizationHandler(organizations, publisher);

    const id = await handler.execute(
      new CreateOrganizationCommand('user-1', 'Clinic One', 'clinic'),
    );

    expect(id).toBeDefined();
    expect(organizations.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
