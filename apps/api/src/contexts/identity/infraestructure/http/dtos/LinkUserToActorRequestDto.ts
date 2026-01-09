import { ActorType } from '../../../domain/value-objects';

export class LinkUserToActorRequestDto {
  userId!: string;
  actorId!: string;
  actorType!: ActorType;
  roleName!: string;
}
