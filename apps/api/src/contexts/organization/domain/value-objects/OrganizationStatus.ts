import {
  InvalidOrganizationStatusError,
  OrganizationStateTransitionNotAllowedError,
} from '../errors';

export type OrganizationStatusValue = 'draft' | 'active' | 'suspended';

export class OrganizationStatus {
  static Draft = new OrganizationStatus('draft');
  static Active = new OrganizationStatus('active');
  static Suspended = new OrganizationStatus('suspended');

  private constructor(public readonly value: OrganizationStatusValue) {}

  static fromValue(value: string): OrganizationStatus {
    switch (value) {
      case 'draft':
        return OrganizationStatus.Draft;
      case 'active':
        return OrganizationStatus.Active;
      case 'suspended':
        return OrganizationStatus.Suspended;
      default:
        throw new InvalidOrganizationStatusError(value);
    }
  }

  canActivate(): boolean {
    return this.value === OrganizationStatus.Draft.value;
  }

  canSuspend(): boolean {
    return this.value === OrganizationStatus.Active.value;
  }

  transitionTo(next: OrganizationStatus): OrganizationStatus {
    if (this.value === next.value) {
      return next;
    }

    if (this.value === OrganizationStatus.Draft.value &&
        next.value === OrganizationStatus.Active.value) {
      return next;
    }

    if (this.value === OrganizationStatus.Active.value &&
        next.value === OrganizationStatus.Suspended.value) {
      return next;
    }

    throw new OrganizationStateTransitionNotAllowedError(
      this.value,
      next.value,
    );
  }
}
