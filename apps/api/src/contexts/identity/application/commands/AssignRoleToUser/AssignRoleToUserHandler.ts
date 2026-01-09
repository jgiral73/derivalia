import { DomainEventPublisher } from 'src/shared';
import { RoleNotFoundError, UserNotFoundError } from '../../../domain/errors';
import { RoleRepository, UserRepository } from '../../../domain/repositories';
import { RoleName, UserId } from '../../../domain/value-objects';
import { AssignRoleToUserCommand } from '.';

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
