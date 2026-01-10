import { DomainEventPublisher } from 'src/shared';
import { DomainEvent } from 'src/shared/DomainEvent';

export class NoopDomainEventPublisher implements DomainEventPublisher {
  async publish(events: DomainEvent[]): Promise<void> {
    console.log(events);
    return Promise.resolve();
  }
}
