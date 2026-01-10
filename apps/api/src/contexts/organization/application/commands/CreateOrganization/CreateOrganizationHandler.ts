import { randomUUID } from 'crypto';
import { DomainEventPublisher } from 'src/shared';
import { Organization } from '../../../domain/aggregates';
import { OrganizationRepository } from '../../../domain/repositories';
import {
  OrganizationId,
  OrganizationName,
  OrganizationType,
} from '../../../domain/value-objects';
import { CreateOrganizationCommand } from './CreateOrganizationCommand';

export class CreateOrganizationHandler {
  constructor(
    private readonly organizations: OrganizationRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<string> {
    const organization = Organization.create({
      id: OrganizationId.fromString(randomUUID()),
      ownerUserId: command.ownerUserId,
      name: OrganizationName.create(command.name),
      type: OrganizationType.fromValue(command.type),
    });

    await this.organizations.save(organization);
    await this.eventPublisher.publish(organization.pullDomainEvents());

    return organization.id.value;
  }
}
