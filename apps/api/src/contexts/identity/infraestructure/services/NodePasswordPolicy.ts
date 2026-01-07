import { pbkdf2, randomBytes, timingSafeEqual } from 'crypto';
import { PasswordPolicy } from '../../domain/services/PasswordPolicy';
import { PasswordHash } from '../../domain/value-objects/PasswordHash';

const ITERATIONS = 120000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

export class NodePasswordPolicy implements PasswordPolicy {
  async hash(plainText: string): Promise<PasswordHash> {
    const salt = randomBytes(16).toString('hex');
    const derived = await this.derive(plainText, salt, ITERATIONS, KEY_LENGTH);
    const encoded = `pbkdf2$${ITERATIONS}$${salt}$${derived}`;
    return PasswordHash.fromHashed(encoded);
  }

  async verify(plainText: string, hash: PasswordHash): Promise<boolean> {
    const parts = hash.value.split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
      return false;
    }

    const iterations = Number(parts[1]);
    const salt = parts[2];
    const stored = parts[3];

    if (!iterations || !salt || !stored) {
      return false;
    }

    const derived = await this.derive(plainText, salt, iterations, KEY_LENGTH);
    const storedBuffer = Buffer.from(stored, 'hex');
    const derivedBuffer = Buffer.from(derived, 'hex');

    if (storedBuffer.length !== derivedBuffer.length) {
      return false;
    }

    return timingSafeEqual(storedBuffer, derivedBuffer);
  }

  private derive(
    plainText: string,
    salt: string,
    iterations: number,
    keyLength: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      pbkdf2(plainText, salt, iterations, keyLength, DIGEST, (err, derived) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(derived.toString('hex'));
      });
    });
  }
}
