import { ActorType } from '../../../domain/value-objects';

export class LinkUserToActorCommand {
  constructor(
    public readonly userId: string,
    public readonly actorId: string,
    public readonly actorType: ActorType,
    public readonly roleName: string,
  ) {}
}
