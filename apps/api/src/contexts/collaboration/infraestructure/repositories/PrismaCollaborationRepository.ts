import { PrismaService } from 'src/shared';
import { Collaboration } from '../../domain/aggregates';
import { CollaborationRepository } from '../../domain/repositories';
import { CollaborationId } from '../../domain/value-objects';
import { CollaborationMapper } from '../mappers';

export class PrismaCollaborationRepository implements CollaborationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(collaboration: Collaboration): Promise<void> {
    const data = CollaborationMapper.toPersistence(collaboration);

    await this.prisma.collaboration.upsert({
      where: {
        id: data.id,
      },
      update: {
        collaboratorProfessionalId: data.collaboratorProfessionalId,
        collaboratorEmail: data.collaboratorEmail,
        purposeSpecialty: data.purposeSpecialty,
        purposeDescription: data.purposeDescription,
        scopeCanViewClinicalRecords: data.scopeCanViewClinicalRecords,
        scopeCanAddNotes: data.scopeCanAddNotes,
        scopeCanSuggestTreatment: data.scopeCanSuggestTreatment,
        scopeCanAccessForms: data.scopeCanAccessForms,
        periodFrom: data.periodFrom,
        periodTo: data.periodTo,
        status: data.status,
        updatedAt: data.updatedAt,
        acceptedAt: data.acceptedAt,
        rejectedAt: data.rejectedAt,
        endedAt: data.endedAt,
      },
      create: {
        id: data.id,
        patientId: data.patientId,
        requesterProfessionalId: data.requesterProfessionalId,
        collaboratorProfessionalId: data.collaboratorProfessionalId,
        collaboratorEmail: data.collaboratorEmail,
        treatmentId: data.treatmentId,
        purposeSpecialty: data.purposeSpecialty,
        purposeDescription: data.purposeDescription,
        scopeCanViewClinicalRecords: data.scopeCanViewClinicalRecords,
        scopeCanAddNotes: data.scopeCanAddNotes,
        scopeCanSuggestTreatment: data.scopeCanSuggestTreatment,
        scopeCanAccessForms: data.scopeCanAccessForms,
        periodFrom: data.periodFrom,
        periodTo: data.periodTo,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        acceptedAt: data.acceptedAt,
        rejectedAt: data.rejectedAt,
        endedAt: data.endedAt,
      },
    });
  }

  async findById(id: CollaborationId): Promise<Collaboration | null> {
    const record = await this.prisma.collaboration.findUnique({
      where: {
        id: id.value,
      },
    });

    if (!record) {
      return null;
    }

    return CollaborationMapper.toDomain(record);
  }
}
