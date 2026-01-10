import { DomainEvent, DomainEventPublisher } from 'src/shared';

export class NoopDomainEventPublisher implements DomainEventPublisher {
  async publish(_events: DomainEvent[]): Promise<void> {}
}
