import { DomainEventPublisher } from 'src/shared';

import { RoleRepository } from '../../../domain/repositories/RoleRepository';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { RoleName } from '../../../domain/value-objects/RoleName';
import { UserId } from '../../../domain/value-objects/UserId';
import {
  RoleNotFoundError,
  UserNotFoundError,
} from '../../../domain/errors/DomainErrors';

import { AssignRoleToUserCommand } from './AssignRoleToUserCommand';

export class AssignRoleToUserHandler {
  constructor(
    private readonly users: UserRepository,
    private readonly roles: RoleRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: AssignRoleToUserCommand): Promise<void> {
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

    await this.users.save(user);
    await this.eventPublisher.publish(user.pullDomainEvents());
  }
}
