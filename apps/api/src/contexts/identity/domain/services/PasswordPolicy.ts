import { PasswordHash } from '../value-objects/PasswordHash';

export interface PasswordPolicy {
  hash(plainText: string): Promise<PasswordHash>;
  verify(plainText: string, hash: PasswordHash): Promise<boolean>;
}
