import { AggregateRoot } from 'src/shared';
import {
  OrganizationActivated,
  OrganizationCreated,
  OrganizationSuspended,
} from '../events';
import {
  OrganizationName,
  OrganizationStatus,
  OrganizationType,
} from '../value-objects';
import { OrganizationId } from '../value-objects/OrganizationId';

export class Organization extends AggregateRoot {
  private status: OrganizationStatus;
  private updatedAt: Date;

  private constructor(
    public readonly id: OrganizationId,
    public readonly ownerUserId: string,
    public readonly name: OrganizationName,
    public readonly type: OrganizationType,
    status: OrganizationStatus,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public readonly createdAt: Date;

  static create(params: {
    id: OrganizationId;
    ownerUserId: string;
    name: OrganizationName;
    type: OrganizationType;
  }): Organization {
    const now = new Date();
    const organization = new Organization(
      params.id,
      params.ownerUserId,
      params.name,
      params.type,
      OrganizationStatus.Draft,
      now,
      now,
    );

    organization.addDomainEvent(
      new OrganizationCreated(
        organization.id.value,
        organization.ownerUserId,
      ),
    );

    return organization;
  }

  static rehydrate(params: {
    id: OrganizationId;
    ownerUserId: string;
    name: OrganizationName;
    type: OrganizationType;
    status: OrganizationStatus;
    createdAt: Date;
    updatedAt: Date;
  }): Organization {
    return new Organization(
      params.id,
      params.ownerUserId,
      params.name,
      params.type,
      params.status,
      params.createdAt,
      params.updatedAt,
    );
  }

  activate(): void {
    this.status = this.status.transitionTo(OrganizationStatus.Active);
    this.updatedAt = new Date();
    this.addDomainEvent(
      new OrganizationActivated(this.id.value, this.ownerUserId),
    );
  }

  suspend(): void {
    this.status = this.status.transitionTo(OrganizationStatus.Suspended);
    this.updatedAt = new Date();
    this.addDomainEvent(
      new OrganizationSuspended(this.id.value, this.ownerUserId),
    );
  }

  isActive(): boolean {
    return this.status.value === OrganizationStatus.Active.value;
  }

  getStatus(): OrganizationStatus {
    return this.status;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
