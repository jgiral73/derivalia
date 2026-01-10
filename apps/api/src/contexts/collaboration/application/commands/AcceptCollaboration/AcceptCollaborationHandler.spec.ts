import { AcceptCollaborationHandler } from './AcceptCollaborationHandler';
import { AcceptCollaborationCommand } from './AcceptCollaborationCommand';
import { CollaborationNotFoundError } from '../../../domain/errors';
import { CollaborationRepository } from '../../../domain/repositories';
import { DomainEventPublisher } from 'src/shared';
import { Collaboration } from '../../../domain/aggregates';
import { CollaborationScope } from '../../../domain/entities';
import {
  CollaborationId,
  CollaborationPurpose,
  CollaborationStatus,
  TimeRange,
} from '../../../domain/value-objects';

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

const buildCollaboration = () =>
  Collaboration.rehydrate({
    id: CollaborationId.fromString('collab-1'),
    patientId: 'patient-1',
    requesterProfessionalId: 'pro-1',
    collaboratorProfessionalId: 'pro-2',
    collaboratorEmail: null,
    treatmentId: null,
    purpose: CollaborationPurpose.create('addictions'),
    scope: new CollaborationScope(true, false, false, false),
    period: TimeRange.create(new Date('2026-01-01'), new Date('2026-02-01')),
    status: CollaborationStatus.Requested,
    createdAt: new Date(),
    updatedAt: new Date(),
    acceptedAt: null,
    rejectedAt: null,
    endedAt: null,
  });

describe('AcceptCollaborationHandler', () => {
  it('throws when collaboration does not exist', async () => {
    const { collaborations, publisher } = buildDeps();
    (collaborations.findById as jest.Mock).mockResolvedValue(null);

    const handler = new AcceptCollaborationHandler(collaborations, publisher);

    await expect(
      handler.execute(new AcceptCollaborationCommand('collab-1', 'pro-2')),
    ).rejects.toThrow(CollaborationNotFoundError);
  });

  it('saves and publishes events', async () => {
    const { collaborations, publisher } = buildDeps();
    (collaborations.findById as jest.Mock).mockResolvedValue(buildCollaboration());

    const handler = new AcceptCollaborationHandler(collaborations, publisher);

    await handler.execute(new AcceptCollaborationCommand('collab-1', 'pro-2'));

    expect(collaborations.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
