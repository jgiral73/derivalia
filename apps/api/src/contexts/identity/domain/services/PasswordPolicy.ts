import { PasswordHash } from '../value-objects';

export interface PasswordPolicy {
  hash(plainText: string): Promise<PasswordHash>;
  verify(plainText: string, hash: PasswordHash): Promise<boolean>;
}
