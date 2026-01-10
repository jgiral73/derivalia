import { PrismaService } from 'src/shared';
import { PatientRepository } from '../../domain/repositories';
import { Patient } from '../../domain/aggregates';
import { PatientId, PatientStatus } from '../../domain/value-objects';
import { PatientMapper } from '../mappers';

export class PrismaPatientRepository implements PatientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(patient: Patient): Promise<void> {
    const data = PatientMapper.toPersistence(patient);

    await this.prisma.$transaction(async (tx) => {
      await tx.patient.upsert({
        where: {
          id: data.id,
        },
        update: {
          fullName: data.fullName,
          createdByProfessionalId: data.createdByProfessionalId,
          userId: data.userId,
          status: PatientStatus.fromValue(data.status).value,
          email: data.email,
          phone: data.phone,
          birthDate: data.birthDate,
          updatedAt: data.updatedAt,
        },
        create: {
          id: data.id,
          fullName: data.fullName,
          createdByProfessionalId: data.createdByProfessionalId,
          userId: data.userId,
          status: PatientStatus.fromValue(data.status).value,
          email: data.email,
          phone: data.phone,
          birthDate: data.birthDate,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
      });
    });
  }

  async findById(id: PatientId): Promise<Patient | null> {
    const record = await this.prisma.patient.findUnique({
      where: {
        id: id.value,
      },
    });

    if (!record) {
      return null;
    }

    return PatientMapper.toDomain(record);
  }

  async findByProfessional(professionalId: string): Promise<Patient[]> {
    const records = await this.prisma.patient.findMany({
      where: {
        createdByProfessionalId: professionalId,
      },
    });

    return records.map((record) => PatientMapper.toDomain(record));
  }
}
