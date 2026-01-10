import { PrismaService } from 'src/shared';
import { Treatment } from '../../domain/aggregates';
import { TreatmentRepository } from '../../domain/repositories';
import { TreatmentId } from '../../domain/value-objects';
import { TreatmentMapper } from '../mappers';

export class PrismaTreatmentRepository implements TreatmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(treatment: Treatment): Promise<void> {
    const data = TreatmentMapper.toPersistence(treatment);

    await this.prisma.treatment.upsert({
      where: {
        id: data.id,
      },
      update: {
        status: data.status,
        endAt: data.endAt,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        patientId: data.patientId,
        professionalId: data.professionalId,
        organizationId: data.organizationId,
        goal: data.goal,
        status: data.status,
        startAt: data.startAt,
        endAt: data.endAt,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: TreatmentId): Promise<Treatment | null> {
    const record = await this.prisma.treatment.findUnique({
      where: {
        id: id.value,
      },
    });

    if (!record) {
      return null;
    }

    return TreatmentMapper.toDomain(record);
  }

  async findActiveForPatient(
    patientId: string,
    professionalId: string,
  ): Promise<Treatment | null> {
    const record = await this.prisma.treatment.findFirst({
      where: {
        patientId,
        professionalId,
        status: 'active',
      },
    });

    if (!record) {
      return null;
    }

    return TreatmentMapper.toDomain(record);
  }
}
