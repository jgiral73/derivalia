import { RequestCollaborationHandler } from './RequestCollaborationHandler';
import { RequestCollaborationCommand } from './RequestCollaborationCommand';
import { CollaborationRepository } from '../../../domain/repositories';
import { DomainEventPublisher } from 'src/shared';

const buildDeps = () => {
  const collaborations: CollaborationRepository = {
    save: jest.fn(),
    findById: jest.fn(),
  };
  const publisher: DomainEventPublisher = {
    publish: jest.fn(async () => undefined),
  };

  return { collaborations, publisher };
};

describe('RequestCollaborationHandler', () => {
  it('saves and publishes events', async () => {
    const { collaborations, publisher } = buildDeps();
    const handler = new RequestCollaborationHandler(
      collaborations,
      publisher,
    );

    const id = await handler.execute(
      new RequestCollaborationCommand(
        'pro-1',
        'patient-1',
        'addictions',
        undefined,
        true,
        false,
        false,
        false,
        new Date('2026-01-01'),
        new Date('2026-02-01'),
        'pro-2',
        undefined,
        undefined,
      ),
    );

    expect(id).toBeDefined();
    expect(collaborations.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
