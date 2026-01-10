import { randomUUID } from 'crypto';
import { DomainEventPublisher } from 'src/shared';
import { ConsentNotFoundError } from '../../../domain/errors';
import { ConsentRepository } from '../../../domain/repositories';
import { ConsentId, ConformityType } from '../../../domain/value-objects';
import { RequestConformityCommand } from './RequestConformityCommand';

export class RequestConformityHandler {
  constructor(
    private readonly consents: ConsentRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: RequestConformityCommand): Promise<string> {
    const consentId = ConsentId.fromString(command.consentId);
    const consent = await this.consents.findById(consentId);

    if (!consent) {
      throw new ConsentNotFoundError();
    }

    const conformity = consent.requestConformity({
      id: randomUUID(),
      type: ConformityType.create(command.type),
    });

    await this.consents.save(consent);
    await this.eventPublisher.publish(consent.pullDomainEvents());

    return conformity.id;
  }
}
