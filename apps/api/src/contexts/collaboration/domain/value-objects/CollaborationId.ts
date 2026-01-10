import { InvalidCollaborationIdError } from '../errors';

export class CollaborationId {
  private constructor(public readonly value: string) {}

  static fromString(value: string): CollaborationId {
    const normalized = value.trim();
    if (!normalized) {
      throw new InvalidCollaborationIdError();
    }
    return new CollaborationId(normalized);
  }
}
