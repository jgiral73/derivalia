export type ActorType = 'professional' | 'patient' | 'organization';

export class ActorReference {
  private constructor(
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
