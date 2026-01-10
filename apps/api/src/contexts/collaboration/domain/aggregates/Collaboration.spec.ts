import { Collaboration } from '.';
import { CollaborationScope } from '../entities';
import {
  CollaborationAccepted,
  CollaborationEnded,
  CollaborationRejected,
  CollaborationRequested,
} from '../events';
import { CollaborationCollaboratorMismatchError } from '../errors';
import {
  CollaborationId,
  CollaborationPurpose,
  CollaborationStatus,
  TimeRange,
} from '../value-objects';

const buildCollaboration = () =>
  Collaboration.request({
    id: CollaborationId.fromString('collab-1'),
    patientId: 'patient-1',
    requesterProfessionalId: 'pro-1',
    collaboratorProfessionalId: 'pro-2',
    purpose: CollaborationPurpose.create('addictions'),
    scope: new CollaborationScope(true, false, false, false),
    period: TimeRange.create(new Date('2026-01-01'), new Date('2026-02-01')),
  });

describe('Collaboration', () => {
  it('emits CollaborationRequested on request', () => {
    const collaboration = buildCollaboration();

    const events = collaboration.pullDomainEvents();

    expect(events[0]).toBeInstanceOf(CollaborationRequested);
  });

  it('emits CollaborationAccepted on accept', () => {
    const collaboration = buildCollaboration();
    collaboration.pullDomainEvents();

    collaboration.accept('pro-2');

    const events = collaboration.pullDomainEvents();

    expect(collaboration.getStatus().value).toBe(CollaborationStatus.Active.value);
    expect(events[0]).toBeInstanceOf(CollaborationAccepted);
  });

  it('emits CollaborationRejected on reject', () => {
    const collaboration = buildCollaboration();
    collaboration.pullDomainEvents();

    collaboration.reject('pro-2');

    const events = collaboration.pullDomainEvents();

    expect(collaboration.getStatus().value).toBe(CollaborationStatus.Rejected.value);
    expect(events[0]).toBeInstanceOf(CollaborationRejected);
  });

  it('emits CollaborationEnded on end', () => {
    const collaboration = buildCollaboration();
    collaboration.pullDomainEvents();
    collaboration.accept('pro-2');
    collaboration.pullDomainEvents();

    collaboration.end('pro-1');

    const events = collaboration.pullDomainEvents();

    expect(collaboration.getStatus().value).toBe(CollaborationStatus.Ended.value);
    expect(events[0]).toBeInstanceOf(CollaborationEnded);
  });

  it('rejects collaborator mismatch', () => {
    const collaboration = buildCollaboration();
    collaboration.pullDomainEvents();

    expect(() => collaboration.accept('pro-3')).toThrow(
      CollaborationCollaboratorMismatchError,
    );
  });
});
