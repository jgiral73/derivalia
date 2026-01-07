import { ActorType } from '../../../domain/value-objects/ActorReference';

export class LinkUserToActorRequestDto {
  userId!: string;
  actorId!: string;
  actorType!: ActorType;
  roleName!: string;
}
