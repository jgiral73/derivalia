import { InvalidConformityStatusError } from '../errors';

export type ConformityStatusValue = 'requested' | 'accepted' | 'rejected';

export class ConformityStatus {
  static Requested = new ConformityStatus('requested');
  static Accepted = new ConformityStatus('accepted');
  static Rejected = new ConformityStatus('rejected');

  private constructor(public readonly value: ConformityStatusValue) {}

  static fromValue(value: string): ConformityStatus {
    switch (value) {
      case 'requested':
        return ConformityStatus.Requested;
      case 'accepted':
        return ConformityStatus.Accepted;
      case 'rejected':
        return ConformityStatus.Rejected;
      default:
        throw new InvalidConformityStatusError(value);
    }
  }
}
