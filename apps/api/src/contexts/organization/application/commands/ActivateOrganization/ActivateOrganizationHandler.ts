import { DomainEventPublisher } from 'src/shared';
import { OrganizationNotFoundError } from '../../../domain/errors';
import { OrganizationRepository } from '../../../domain/repositories';
import { OrganizationId } from '../../../domain/value-objects';
import { ActivateOrganizationCommand } from './ActivateOrganizationCommand';

export class ActivateOrganizationHandler {
  constructor(
    private readonly organizations: OrganizationRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: ActivateOrganizationCommand): Promise<void> {
    const id = OrganizationId.fromString(command.organizationId);
    const organization = await this.organizations.findById(id);

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    organization.activate();

    await this.organizations.save(organization);
    await this.eventPublisher.publish(organization.pullDomainEvents());
  }
}
