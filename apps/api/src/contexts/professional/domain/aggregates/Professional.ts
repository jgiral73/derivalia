import { AggregateRoot } from 'src/shared';
import {
  ProfessionalCreated,
  ProfessionalInvited,
  ProfessionalOnboardingCompleted,
  ProfessionalProfileUpdated,
  ProfessionalSuspended,
} from '../events';
import {
  ProfessionalStateTransitionNotAllowedError,
  ProfessionalSuspendedError,
} from '../errors';
import {
  FullName,
  LicenseNumber,
  ProfessionalId,
  ProfessionalStatus,
  Specialty,
} from '../value-objects';

export class Professional extends AggregateRoot {
  private status: ProfessionalStatus;
  private fullName: FullName | null;
  private licenseNumber: LicenseNumber | null;
  private specialties: Specialty[];
  private updatedAt: Date;

  private constructor(
    public readonly id: ProfessionalId,
    public readonly userId: string | null,
    public readonly email: string | null,
    status: ProfessionalStatus,
    fullName: FullName | null,
    licenseNumber: LicenseNumber | null,
    specialties: Specialty[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.status = status;
    this.fullName = fullName;
    this.licenseNumber = licenseNumber;
    this.specialties = specialties;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public readonly createdAt: Date;

  static invite(params: { id: ProfessionalId; email: string }): Professional {
    const now = new Date();
    const professional = new Professional(
      params.id,
      null,
      params.email,
      ProfessionalStatus.Invited,
      null,
      null,
      [],
      now,
      now,
    );

    professional.addDomainEvent(
      new ProfessionalInvited(professional.id.value, params.email),
    );

    return professional;
  }

  static create(params: {
    id: ProfessionalId;
    userId: string;
    email?: string | null;
  }): Professional {
    const now = new Date();
    const professional = new Professional(
      params.id,
      params.userId,
      params.email ?? null,
      ProfessionalStatus.PartialOnboarding,
      null,
      null,
      [],
      now,
      now,
    );

    professional.addDomainEvent(
      new ProfessionalCreated(professional.id.value, params.userId),
    );

    return professional;
  }

  static rehydrate(params: {
    id: ProfessionalId;
    userId: string | null;
    email: string | null;
    status: ProfessionalStatus;
    fullName: FullName | null;
    licenseNumber: LicenseNumber | null;
    specialties: Specialty[];
    createdAt: Date;
    updatedAt: Date;
  }): Professional {
    return new Professional(
      params.id,
      params.userId,
      params.email,
      params.status,
      params.fullName,
      params.licenseNumber,
      params.specialties,
      params.createdAt,
      params.updatedAt,
    );
  }

  completeOnboarding(params: {
    fullName: FullName;
    licenseNumber: LicenseNumber;
    specialties: Specialty[];
  }): void {
    this.ensureNotSuspended();

    if (this.status.value !== ProfessionalStatus.PartialOnboarding.value) {
      throw new ProfessionalStateTransitionNotAllowedError(
        this.status.value,
        ProfessionalStatus.Active.value,
      );
    }

    this.fullName = params.fullName;
    this.licenseNumber = params.licenseNumber;
    this.specialties = params.specialties;
    this.status = this.status.transitionTo(ProfessionalStatus.Active);
    this.updatedAt = new Date();

    if (this.userId) {
      this.addDomainEvent(
        new ProfessionalOnboardingCompleted(this.id.value, this.userId),
      );
    }
  }

  updateProfile(params: {
    fullName?: FullName | null;
    licenseNumber?: LicenseNumber | null;
    specialties?: Specialty[];
  }): void {
    this.ensureNotSuspended();

    if (params.fullName) {
      this.fullName = params.fullName;
    }
    if (params.licenseNumber) {
      this.licenseNumber = params.licenseNumber;
    }
    if (params.specialties) {
      this.specialties = params.specialties;
    }

    this.updatedAt = new Date();

    if (this.userId) {
      this.addDomainEvent(
        new ProfessionalProfileUpdated(this.id.value, this.userId),
      );
    }
  }

  suspend(reason?: string): void {
    if (this.status.value === ProfessionalStatus.Suspended.value) {
      return;
    }

    this.status = this.status.transitionTo(ProfessionalStatus.Suspended);
    this.updatedAt = new Date();
    this.addDomainEvent(new ProfessionalSuspended(this.id.value, reason));
  }

  getStatus(): ProfessionalStatus {
    return this.status;
  }

  getFullName(): FullName | null {
    return this.fullName;
  }

  getLicenseNumber(): LicenseNumber | null {
    return this.licenseNumber;
  }

  getSpecialties(): Specialty[] {
    return [...this.specialties];
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getCapabilities(): string[] {
    if (this.status.value === ProfessionalStatus.Active.value) {
      return ['patient.read', 'patient.write'];
    }
    return [];
  }

  private ensureNotSuspended(): void {
    if (this.status.value === ProfessionalStatus.Suspended.value) {
      throw new ProfessionalSuspendedError();
    }
  }
}
