import { AggregateRoot } from './AggregateRoot';
import { Role } from '../entities/Role';
import { ActorReference } from '../value-objects/ActorReference';
import { Email } from '../value-objects/Email';
import { PasswordHash } from '../value-objects/PasswordHash';
import { UserId } from '../value-objects/UserId';
import { UserState } from '../value-objects/UserState';
import {
  ActorAlreadyLinkedError,
  RoleAlreadyAssignedError,
  UserAlreadyArchivedError,
  UserAlreadyActiveError,
  UserAlreadyDisabledError,
  UserMustBeDisabledToArchiveError,
  UserArchivedError,
  UserDisabledError,
} from '../errors/DomainErrors';
import { AccountArchived } from '../events/AccountArchived';
import { AccountDisabled } from '../events/AccountDisabled';
import { AccountEnabled } from '../events/AccountEnabled';
import { RoleAssigned } from '../events/RoleAssigned';
import { UserAuthenticated } from '../events/UserAuthenticated';
import { UserLinkedToActor } from '../events/UserLinkedToActor';
import { UserRegistered } from '../events/UserRegistered';

export class User extends AggregateRoot {
  private roles: Role[];
  private actorLinks: ActorReference[];
  private state: UserState;

  private constructor(
    public readonly id: UserId,
    public readonly email: Email,
    private passwordHash: PasswordHash,
    roles: Role[],
    actorLinks: ActorReference[],
    state: UserState,
  ) {
    super();
    this.roles = roles;
    this.actorLinks = actorLinks;
    this.state = state;
  }

  static register(id: UserId, email: Email, passwordHash: PasswordHash): User {
    const user = new User(
      id,
      email,
      passwordHash,
      [],
      [],
      UserState.Registered,
    );
    user.addDomainEvent(new UserRegistered(id.value, email.value));
    return user;
  }

  assignRole(role: Role): void {
    this.ensureNotDisabledOrArchived();

    if (this.roles.some((existing) => existing.equals(role))) {
      throw new RoleAlreadyAssignedError();
    }

    this.roles.push(role);
    this.addDomainEvent(
      new RoleAssigned(this.id.value, role.id, role.name.value),
    );

    if (this.state.value === UserState.Registered.value) {
      this.activate();
    }
  }

  linkToActor(reference: ActorReference): void {
    this.ensureNotDisabledOrArchived();

    if (this.actorLinks.some((link) => link.equals(reference))) {
      throw new ActorAlreadyLinkedError();
    }

    this.actorLinks.push(reference);
    this.addDomainEvent(
      new UserLinkedToActor(
        this.id.value,
        reference.actorId,
        reference.actorType,
      ),
    );
  }

  authenticate(): void {
    this.ensureNotDisabledOrArchived();
    this.addDomainEvent(new UserAuthenticated(this.id.value));
  }

  disable(reason?: string): void {
    if (this.state.value === UserState.Archived.value) {
      throw new UserArchivedError();
    }
    if (this.state.value === UserState.Disabled.value) {
      throw new UserAlreadyDisabledError();
    }

    this.state = this.state.transitionTo(UserState.Disabled);
    this.addDomainEvent(new AccountDisabled(this.id.value, reason));
  }

  enable(): void {
    if (this.state.value === UserState.Archived.value) {
      throw new UserAlreadyArchivedError();
    }
    if (this.state.value === UserState.Active.value) {
      throw new UserAlreadyActiveError();
    }

    this.state.ensureCanActivate(this.roles.length > 0);
    this.state = this.state.transitionTo(UserState.Active);
    this.addDomainEvent(new AccountEnabled(this.id.value));
  }

  archive(): void {
    if (this.state.value === UserState.Archived.value) {
      throw new UserAlreadyArchivedError();
    }

    if (this.state.value !== UserState.Disabled.value) {
      throw new UserMustBeDisabledToArchiveError();
    }

    this.state = this.state.transitionTo(UserState.Archived);
    this.addDomainEvent(new AccountArchived(this.id.value));
  }

  isActive(): boolean {
    return this.state.value === UserState.Active.value;
  }

  getRoles(): Role[] {
    return [...this.roles];
  }

  getActorLinks(): ActorReference[] {
    return [...this.actorLinks];
  }

  getState(): UserState {
    return this.state;
  }

  getPasswordHash(): PasswordHash {
    return this.passwordHash;
  }

  private activate(): void {
    this.state.ensureCanActivate(this.roles.length > 0);
    this.state = this.state.transitionTo(UserState.Active);
    this.addDomainEvent(new AccountEnabled(this.id.value));
  }

  private ensureNotDisabledOrArchived(): void {
    if (this.state.value === UserState.Disabled.value) {
      throw new UserDisabledError();
    }
    if (this.state.value === UserState.Archived.value) {
      throw new UserArchivedError();
    }
  }
}
