import { DomainEventPublisher } from 'src/shared';
import { OrganizationNotFoundError } from '../../../domain/errors';
import { OrganizationRepository } from '../../../domain/repositories';
import { OrganizationId } from '../../../domain/value-objects';
import { SuspendOrganizationCommand } from './SuspendOrganizationCommand';

export class SuspendOrganizationHandler {
  constructor(
    private readonly organizations: OrganizationRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: SuspendOrganizationCommand): Promise<void> {
    const id = OrganizationId.fromString(command.organizationId);
    const organization = await this.organizations.findById(id);

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    organization.suspend();

    await this.organizations.save(organization);
    await this.eventPublisher.publish(organization.pullDomainEvents());
  }
}
