import { DomainEventPublisher } from '../../application/services/DomainEventPublisher';
import { DomainEvent } from '../../domain/events/DomainEvent';

export class NoopDomainEventPublisher implements DomainEventPublisher {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async publish(_events: DomainEvent[]): Promise<void> {
    return Promise.resolve();
  }
}
