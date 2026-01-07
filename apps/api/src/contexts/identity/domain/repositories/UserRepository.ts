import { Email } from '../value-objects/Email';
import { User } from '../aggregates/User';
import { UserId } from '../value-objects/UserId';

export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<void>;
}
