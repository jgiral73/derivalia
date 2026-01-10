import { DomainEventPublisher } from 'src/shared';
import { CollaborationNotFoundError } from '../../../domain/errors';
import { CollaborationRepository } from '../../../domain/repositories';
import { CollaborationId } from '../../../domain/value-objects';
import { EndCollaborationCommand } from './EndCollaborationCommand';

export class EndCollaborationHandler {
  constructor(
    private readonly collaborations: CollaborationRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: EndCollaborationCommand): Promise<void> {
    const id = CollaborationId.fromString(command.collaborationId);
    const collaboration = await this.collaborations.findById(id);

    if (!collaboration) {
      throw new CollaborationNotFoundError();
    }

    collaboration.end(command.endedByProfessionalId ?? null);

    await this.collaborations.save(collaboration);
    await this.eventPublisher.publish(collaboration.pullDomainEvents());
  }
}
