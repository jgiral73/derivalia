import {
  CollaborationStatus as PrismaCollaborationStatus,
  Prisma,
} from '@prisma/client';
import { Collaboration } from '../../domain/aggregates';
import { CollaborationScope } from '../../domain/entities';
import {
  CollaborationId,
  CollaborationPurpose,
  CollaborationStatus,
  TimeRange,
} from '../../domain/value-objects';

export type PrismaCollaboration = Prisma.CollaborationGetPayload<object>;

export class CollaborationMapper {
  static toDomain(record: PrismaCollaboration): Collaboration {
    return Collaboration.rehydrate({
      id: CollaborationId.fromString(record.id),
      patientId: record.patientId,
      requesterProfessionalId: record.requesterProfessionalId,
      collaboratorProfessionalId: record.collaboratorProfessionalId,
      collaboratorEmail: record.collaboratorEmail,
      treatmentId: record.treatmentId,
      purpose: CollaborationPurpose.create(
        record.purposeSpecialty,
        record.purposeDescription ?? undefined,
      ),
      scope: new CollaborationScope(
        record.scopeCanViewClinicalRecords,
        record.scopeCanAddNotes,
        record.scopeCanSuggestTreatment,
        record.scopeCanAccessForms,
      ),
      period: TimeRange.create(record.periodFrom, record.periodTo ?? undefined),
      status: CollaborationStatus.fromValue(record.status),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      acceptedAt: record.acceptedAt,
      rejectedAt: record.rejectedAt,
      endedAt: record.endedAt,
    });
  }

  static toPersistence(collaboration: Collaboration): {
    id: string;
    patientId: string;
    requesterProfessionalId: string;
    collaboratorProfessionalId: string | null;
    collaboratorEmail: string | null;
    treatmentId: string | null;
    purposeSpecialty: string;
    purposeDescription: string | null;
    scopeCanViewClinicalRecords: boolean;
    scopeCanAddNotes: boolean;
    scopeCanSuggestTreatment: boolean;
    scopeCanAccessForms: boolean;
    periodFrom: Date;
    periodTo: Date | null;
    status: PrismaCollaborationStatus;
    createdAt: Date;
    updatedAt: Date;
    acceptedAt: Date | null;
    rejectedAt: Date | null;
    endedAt: Date | null;
  } {
    return {
      id: collaboration.id.value,
      patientId: collaboration.patientId,
      requesterProfessionalId: collaboration.requesterProfessionalId,
      collaboratorProfessionalId: collaboration.getCollaboratorProfessionalId(),
      collaboratorEmail: collaboration.getCollaboratorEmail(),
      treatmentId: collaboration.treatmentId,
      purposeSpecialty: collaboration.purpose.specialty,
      purposeDescription: collaboration.purpose.description ?? null,
      scopeCanViewClinicalRecords: collaboration.scope.canViewClinicalRecords,
      scopeCanAddNotes: collaboration.scope.canAddNotes,
      scopeCanSuggestTreatment: collaboration.scope.canSuggestTreatment,
      scopeCanAccessForms: collaboration.scope.canAccessForms,
      periodFrom: collaboration.period.from,
      periodTo: collaboration.period.to ?? null,
      status: collaboration.getStatus().value as PrismaCollaborationStatus,
      createdAt: collaboration.createdAt,
      updatedAt: collaboration.getUpdatedAt(),
      acceptedAt: collaboration.getAcceptedAt(),
      rejectedAt: collaboration.getRejectedAt(),
      endedAt: collaboration.getEndedAt(),
    };
  }
}
