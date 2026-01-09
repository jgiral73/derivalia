import { DomainEventPublisher } from 'src/shared';

import { RoleRepository } from '../../../domain/repositories/RoleRepository';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { ActorReference } from '../../../domain/value-objects/ActorReference';
import { RoleName } from '../../../domain/value-objects/RoleName';
import { UserId } from '../../../domain/value-objects/UserId';
import {
  UserNotFoundError,
  RoleNotFoundError,
} from '../../../domain/errors/DomainErrors';

import { LinkUserToActorCommand } from './LinkUserToActorCommand';

export class LinkUserToActorHandler {
  constructor(
    private readonly users: UserRepository,
    private readonly roles: RoleRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: LinkUserToActorCommand): Promise<void> {
    const userId = UserId.fromString(command.userId);
    const user = await this.users.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const role = await this.roles.findByName(RoleName.create(command.roleName));

    if (!role) {
      throw new RoleNotFoundError();
    }

    user.assignRole(role);
    user.linkToActor(ActorReference.create(command.actorId, command.actorType));

    await this.users.save(user);
    await this.eventPublisher.publish(user.pullDomainEvents());
  }
}
