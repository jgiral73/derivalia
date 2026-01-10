import { CollaborationStatus } from '.';
import { CollaborationStateTransitionNotAllowedError } from '../errors';

describe('CollaborationStatus', () => {
  it('allows requested to active', () => {
    const next = CollaborationStatus.Requested.transitionTo(
      CollaborationStatus.Active,
    );

    expect(next.value).toBe('active');
  });

  it('allows requested to rejected', () => {
    const next = CollaborationStatus.Requested.transitionTo(
      CollaborationStatus.Rejected,
    );

    expect(next.value).toBe('rejected');
  });

  it('allows active to ended', () => {
    const next = CollaborationStatus.Active.transitionTo(
      CollaborationStatus.Ended,
    );

    expect(next.value).toBe('ended');
  });

  it('rejects invalid transitions', () => {
    expect(() =>
      CollaborationStatus.Rejected.transitionTo(CollaborationStatus.Active),
    ).toThrow(CollaborationStateTransitionNotAllowedError);
  });
});
