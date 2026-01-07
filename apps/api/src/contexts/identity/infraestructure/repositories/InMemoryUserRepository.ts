import { User } from '../../domain/aggregates/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { Email } from '../../domain/value-objects/Email';
import { UserId } from '../../domain/value-objects/UserId';

export class InMemoryUserRepository implements UserRepository {
  private readonly usersById = new Map<string, User>();
  private readonly userIdByEmail = new Map<string, string>();

  async findByEmail(email: Email): Promise<User | null> {
    const id = this.userIdByEmail.get(email.value);
    if (!id) {
      return Promise.resolve(null);
    }

    return Promise.resolve(this.usersById.get(id) ?? null);
  }

  async findById(id: UserId): Promise<User | null> {
    return Promise.resolve(this.usersById.get(id.value) ?? null);
  }

  async save(user: User): Promise<void> {
    this.usersById.set(user.id.value, user);
    this.userIdByEmail.set(user.email.value, user.id.value);
    return Promise.resolve();
  }
}
