import { randomUUID } from 'crypto';
import { DomainEventPublisher } from 'src/shared';
import { Consent } from '../../../domain/aggregates';
import { ConsentRepository } from '../../../domain/repositories';
import {
  ConsentId,
  ConsentPurpose,
  ConsentScope,
} from '../../../domain/value-objects';
import { RequestConsentCommand } from './RequestConsentCommand';

export class RequestConsentHandler {
  constructor(
    private readonly consents: ConsentRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: RequestConsentCommand): Promise<string> {
    const consent = Consent.request({
      id: ConsentId.fromString(randomUUID()),
      patientId: command.patientId,
      granteeId: command.granteeId,
      scope: ConsentScope.create(command.scopeType, command.scopeRef),
      purpose: ConsentPurpose.create(command.purpose),
      validFrom: new Date(),
      validUntil: command.validUntil ?? null,
    });

    await this.consents.save(consent);
    await this.eventPublisher.publish(consent.pullDomainEvents());

    return consent.id.value;
  }
}
