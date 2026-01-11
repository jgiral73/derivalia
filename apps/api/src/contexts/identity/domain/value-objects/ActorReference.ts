export type ActorType = 'professional' | 'patient' | 'organization';

/**
 * ```typescript
 * export type ActorType = 'professional' | 'patient' | 'organization';
 * ```
 */
export class ActorReference {
  private constructor(
    /** Quan actorType === 'patient' llavors actorId === Patient.id.
     *  Quan actorType === 'professional' llavors actorId === Professional.id.
     *  Quan actorType === 'organization' llavors actorId === Organization.id. */
    public readonly actorId: string,
    public readonly actorType: ActorType,
  ) {}

  static create(actorId: string, actorType: ActorType): ActorReference {
    return new ActorReference(actorId, actorType);
  }

  equals(other: ActorReference): boolean {
    return this.actorId === other.actorId && this.actorType === other.actorType;
  }
}
