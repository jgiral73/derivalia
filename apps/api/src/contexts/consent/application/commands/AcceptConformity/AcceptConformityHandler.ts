import { DomainEventPublisher } from 'src/shared';
import { ConsentNotFoundError } from '../../../domain/errors';
import { ConsentRepository } from '../../../domain/repositories';
import { ConsentId } from '../../../domain/value-objects';
import { AcceptConformityCommand } from './AcceptConformityCommand';

export class AcceptConformityHandler {
  constructor(
    private readonly consents: ConsentRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: AcceptConformityCommand): Promise<void> {
    const consentId = ConsentId.fromString(command.consentId);
    const consent = await this.consents.findById(consentId);

    if (!consent) {
      throw new ConsentNotFoundError();
    }

    consent.acceptConformity(command.conformityId);

    await this.consents.save(consent);
    await this.eventPublisher.publish(consent.pullDomainEvents());
  }
}
