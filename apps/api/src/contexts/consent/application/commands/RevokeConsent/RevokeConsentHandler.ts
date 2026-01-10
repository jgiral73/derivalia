import { DomainEventPublisher } from 'src/shared';
import { ConsentNotFoundError } from '../../../domain/errors';
import { ConsentRepository } from '../../../domain/repositories';
import { ConsentId } from '../../../domain/value-objects';
import { RevokeConsentCommand } from './RevokeConsentCommand';

export class RevokeConsentHandler {
  constructor(
    private readonly consents: ConsentRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: RevokeConsentCommand): Promise<void> {
    const consentId = ConsentId.fromString(command.consentId);
    const consent = await this.consents.findById(consentId);

    if (!consent) {
      throw new ConsentNotFoundError();
    }

    consent.revoke();

    await this.consents.save(consent);
    await this.eventPublisher.publish(consent.pullDomainEvents());
  }
}
