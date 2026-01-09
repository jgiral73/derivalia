import { DomainEventPublisher } from 'src/shared';
import { DomainEvent } from 'src/shared';

export class NoopDomainEventPublisher implements DomainEventPublisher {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async publish(_events: DomainEvent[]): Promise<void> {
    return Promise.resolve();
  }
}
