import { InvalidCollaborationPurposeError } from '../errors';

export class CollaborationPurpose {
  private constructor(
    public readonly specialty: string,
    public readonly description?: string,
  ) {}

  static create(specialty: string, description?: string): CollaborationPurpose {
    const normalized = specialty.trim();
    if (!normalized) {
      throw new InvalidCollaborationPurposeError(specialty);
    }
    const normalizedDescription = description?.trim();
    return new CollaborationPurpose(normalized, normalizedDescription || undefined);
  }
}
