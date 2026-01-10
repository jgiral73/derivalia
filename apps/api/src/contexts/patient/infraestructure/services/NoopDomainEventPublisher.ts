import { DomainEvent, DomainEventPublisher } from 'src/shared';

export class NoopDomainEventPublisher implements DomainEventPublisher {
  async publish(events: DomainEvent[]): Promise<void> {
    console.log(events);
    return Promise.resolve();
  }
}
