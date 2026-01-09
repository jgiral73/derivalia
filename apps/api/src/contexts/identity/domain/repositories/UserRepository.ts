import { Email, UserId } from '../value-objects';
import { User } from '../aggregates';

export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<void>;
}
