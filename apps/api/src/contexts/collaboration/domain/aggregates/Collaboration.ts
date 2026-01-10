import { AggregateRoot } from 'src/shared';
import { CollaborationScope } from '../entities';
import {
  CollaborationAccepted,
  CollaborationEnded,
  CollaborationRejected,
  CollaborationRequested,
} from '../events';
import {
  CollaborationCollaboratorMismatchError,
  InvalidCollaborationParticipantError,
} from '../errors';
import {
  CollaborationId,
  CollaborationPurpose,
  CollaborationStatus,
  TimeRange,
} from '../value-objects';

export class Collaboration extends AggregateRoot {
  private status: CollaborationStatus;
  private updatedAt: Date;
  private acceptedAt: Date | null;
  private rejectedAt: Date | null;
  private endedAt: Date | null;
  private collaboratorProfessionalId: string | null;
  private collaboratorEmail: string | null;

  private constructor(
    public readonly id: CollaborationId,
    public readonly patientId: string,
    public readonly requesterProfessionalId: string,
    collaboratorProfessionalId: string | null,
    collaboratorEmail: string | null,
    public readonly treatmentId: string | null,
    public readonly purpose: CollaborationPurpose,
    public readonly scope: CollaborationScope,
    public readonly period: TimeRange,
    status: CollaborationStatus,
    createdAt: Date,
    updatedAt: Date,
    acceptedAt: Date | null,
    rejectedAt: Date | null,
    endedAt: Date | null,
  ) {
    super();
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.acceptedAt = acceptedAt;
    this.rejectedAt = rejectedAt;
    this.endedAt = endedAt;
    this.collaboratorProfessionalId = collaboratorProfessionalId;
    this.collaboratorEmail = collaboratorEmail;
  }

  public readonly createdAt: Date;

  static request(params: {
    id: CollaborationId;
    patientId: string;
    requesterProfessionalId: string;
    collaboratorProfessionalId?: string | null;
    collaboratorEmail?: string | null;
    treatmentId?: string | null;
    purpose: CollaborationPurpose;
    scope: CollaborationScope;
    period: TimeRange;
  }): Collaboration {
    const collaboratorProfessionalId = params.collaboratorProfessionalId ?? null;
    const collaboratorEmail = params.collaboratorEmail ?? null;
    if (!collaboratorProfessionalId && !collaboratorEmail) {
      throw new InvalidCollaborationParticipantError();
    }

    const now = new Date();
    const collaboration = new Collaboration(
      params.id,
      params.patientId,
      params.requesterProfessionalId,
      collaboratorProfessionalId,
      collaboratorEmail,
      params.treatmentId ?? null,
      params.purpose,
      params.scope,
      params.period,
      CollaborationStatus.Requested,
      now,
      now,
      null,
      null,
      null,
    );

    collaboration.addDomainEvent(
      new CollaborationRequested(
        collaboration.id.value,
        collaboration.patientId,
        collaboration.requesterProfessionalId,
        collaboration.collaboratorProfessionalId,
        collaboration.collaboratorEmail,
        collaboration.treatmentId,
      ),
    );

    return collaboration;
  }

  static rehydrate(params: {
    id: CollaborationId;
    patientId: string;
    requesterProfessionalId: string;
    collaboratorProfessionalId: string | null;
    collaboratorEmail: string | null;
    treatmentId: string | null;
    purpose: CollaborationPurpose;
    scope: CollaborationScope;
    period: TimeRange;
    status: CollaborationStatus;
    createdAt: Date;
    updatedAt: Date;
    acceptedAt: Date | null;
    rejectedAt: Date | null;
    endedAt: Date | null;
  }): Collaboration {
    return new Collaboration(
      params.id,
      params.patientId,
      params.requesterProfessionalId,
      params.collaboratorProfessionalId,
      params.collaboratorEmail,
      params.treatmentId,
      params.purpose,
      params.scope,
      params.period,
      params.status,
      params.createdAt,
      params.updatedAt,
      params.acceptedAt,
      params.rejectedAt,
      params.endedAt,
    );
  }

  accept(collaboratorProfessionalId: string): void {
    this.ensureCollaboratorMatches(collaboratorProfessionalId);
    this.status = this.status.transitionTo(CollaborationStatus.Active);
    this.acceptedAt = new Date();
    this.updatedAt = new Date();
    this.addDomainEvent(
      new CollaborationAccepted(this.id.value, collaboratorProfessionalId),
    );
  }

  reject(collaboratorProfessionalId: string): void {
    this.ensureCollaboratorMatches(collaboratorProfessionalId);
    this.status = this.status.transitionTo(CollaborationStatus.Rejected);
    this.rejectedAt = new Date();
    this.updatedAt = new Date();
    this.addDomainEvent(
      new CollaborationRejected(this.id.value, collaboratorProfessionalId),
    );
  }

  end(endedByProfessionalId: string | null = null): void {
    this.status = this.status.transitionTo(CollaborationStatus.Ended);
    this.endedAt = new Date();
    this.updatedAt = new Date();
    this.addDomainEvent(
      new CollaborationEnded(this.id.value, endedByProfessionalId),
    );
  }

  getStatus(): CollaborationStatus {
    return this.status;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getAcceptedAt(): Date | null {
    return this.acceptedAt;
  }

  getRejectedAt(): Date | null {
    return this.rejectedAt;
  }

  getEndedAt(): Date | null {
    return this.endedAt;
  }

  getCollaboratorProfessionalId(): string | null {
    return this.collaboratorProfessionalId;
  }

  getCollaboratorEmail(): string | null {
    return this.collaboratorEmail;
  }

  private ensureCollaboratorMatches(collaboratorProfessionalId: string): void {
    if (
      this.collaboratorProfessionalId &&
      this.collaboratorProfessionalId !== collaboratorProfessionalId
    ) {
      throw new CollaborationCollaboratorMismatchError();
    }

    if (!this.collaboratorProfessionalId) {
      this.collaboratorProfessionalId = collaboratorProfessionalId;
      this.collaboratorEmail = null;
    }
  }
}
