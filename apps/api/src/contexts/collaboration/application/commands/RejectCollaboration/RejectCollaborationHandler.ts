import { DomainEventPublisher } from 'src/shared';
import { CollaborationNotFoundError } from '../../../domain/errors';
import { CollaborationRepository } from '../../../domain/repositories';
import { CollaborationId } from '../../../domain/value-objects';
import { RejectCollaborationCommand } from './RejectCollaborationCommand';

export class RejectCollaborationHandler {
  constructor(
    private readonly collaborations: CollaborationRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: RejectCollaborationCommand): Promise<void> {
    const id = CollaborationId.fromString(command.collaborationId);
    const collaboration = await this.collaborations.findById(id);

    if (!collaboration) {
      throw new CollaborationNotFoundError();
    }

    collaboration.reject(command.collaboratorProfessionalId);

    await this.collaborations.save(collaboration);
    await this.eventPublisher.publish(collaboration.pullDomainEvents());
  }
}
