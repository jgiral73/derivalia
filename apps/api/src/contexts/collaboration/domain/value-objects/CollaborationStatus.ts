import {
  CollaborationStateTransitionNotAllowedError,
  InvalidCollaborationStatusError,
} from '../errors';

export type CollaborationStatusValue =
  | 'requested'
  | 'active'
  | 'rejected'
  | 'ended';

export class CollaborationStatus {
  static Requested = new CollaborationStatus('requested');
  static Active = new CollaborationStatus('active');
  static Rejected = new CollaborationStatus('rejected');
  static Ended = new CollaborationStatus('ended');

  private constructor(public readonly value: CollaborationStatusValue) {}

  static fromValue(value: string): CollaborationStatus {
    switch (value) {
      case 'requested':
        return CollaborationStatus.Requested;
      case 'active':
        return CollaborationStatus.Active;
      case 'rejected':
        return CollaborationStatus.Rejected;
      case 'ended':
        return CollaborationStatus.Ended;
      default:
        throw new InvalidCollaborationStatusError(value);
    }
  }

  transitionTo(next: CollaborationStatus): CollaborationStatus {
    if (this.value === next.value) {
      return next;
    }

    if (this.value === CollaborationStatus.Requested.value &&
        (next.value === CollaborationStatus.Active.value ||
          next.value === CollaborationStatus.Rejected.value)) {
      return next;
    }

    if (this.value === CollaborationStatus.Active.value &&
        next.value === CollaborationStatus.Ended.value) {
      return next;
    }

    throw new CollaborationStateTransitionNotAllowedError(
      this.value,
      next.value,
    );
  }
}
