import { AggregateRoot } from 'src/shared';

import { PatientArchived, PatientCreated, PatientUpdated } from '../events';
import {
  PatientAlreadyArchivedError,
  PatientStateTransitionNotAllowedError,
} from '../errors';
import {
  BirthDate,
  ContactInfo,
  PatientId,
  PatientName,
  PatientStatus,
} from '../value-objects';

export class Patient extends AggregateRoot {
  private status: PatientStatus;
  private userId: string | null;
  private contactInfo: ContactInfo | null;
  private birthDate: BirthDate | null;
  private updatedAt: Date;

  private constructor(
    public readonly id: PatientId,
    public readonly name: PatientName,
    public readonly createdByProfessionalId: string,
    status: PatientStatus,
    userId: string | null,
    birthDate: BirthDate | null,
    contactInfo: ContactInfo | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.status = status;
    this.userId = userId;
    this.birthDate = birthDate;
    this.contactInfo = contactInfo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public readonly createdAt: Date;

  static create(params: {
    id: PatientId;
    name: PatientName;
    createdByProfessionalId: string;
    birthDate?: BirthDate | null;
    contactInfo?: ContactInfo | null;
  }): Patient {
    const now = new Date();
    const patient = new Patient(
      params.id,
      params.name,
      params.createdByProfessionalId,
      PatientStatus.CreatedByProfessional,
      null,
      params.birthDate ?? null,
      params.contactInfo ?? null,
      now,
      now,
    );

    patient.addDomainEvent(
      new PatientCreated(patient.id.value, patient.createdByProfessionalId),
    );

    return patient;
  }

  static rehydrate(params: {
    id: PatientId;
    name: PatientName;
    createdByProfessionalId: string;
    status: PatientStatus;
    userId?: string | null;
    birthDate?: BirthDate | null;
    contactInfo?: ContactInfo | null;
    createdAt: Date;
    updatedAt: Date;
  }): Patient {
    return new Patient(
      params.id,
      params.name,
      params.createdByProfessionalId,
      params.status,
      params.userId ?? null,
      params.birthDate ?? null,
      params.contactInfo ?? null,
      params.createdAt,
      params.updatedAt,
    );
  }

  invite(contactInfo: ContactInfo): void {
    if (this.status.value !== PatientStatus.CreatedByProfessional.value) {
      throw new PatientStateTransitionNotAllowedError(
        this.status.value,
        PatientStatus.Invited.value,
      );
    }

    this.status = this.status.transitionTo(PatientStatus.Invited);
    this.contactInfo = contactInfo;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new PatientUpdated(
        this.id.value,
        this.status.value,
        this.userId ?? undefined,
      ),
    );
  }

  registerUser(userId: string): void {
    if (this.status.value !== PatientStatus.Invited.value) {
      throw new PatientStateTransitionNotAllowedError(
        this.status.value,
        PatientStatus.Active.value,
      );
    }

    this.status = this.status.transitionTo(PatientStatus.Active);
    this.userId = userId;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new PatientUpdated(this.id.value, this.status.value, this.userId),
    );
  }

  archive(): void {
    if (this.status.value === PatientStatus.Archived.value) {
      throw new PatientAlreadyArchivedError();
    }

    this.status = this.status.transitionTo(PatientStatus.Archived);
    this.updatedAt = new Date();
    this.addDomainEvent(new PatientArchived(this.id.value));
  }

  getStatus(): PatientStatus {
    return this.status;
  }

  getUserId(): string | null {
    return this.userId;
  }

  getBirthDate(): BirthDate | null {
    return this.birthDate;
  }

  getContactInfo(): ContactInfo | null {
    return this.contactInfo;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
