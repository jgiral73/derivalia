import { PrismaService } from 'src/shared';
import { InvalidProfessionalIdError } from '../../domain/errors';
import { ProfessionalRepository } from '../../domain/repositories';
import { Professional } from '../../domain/aggregates';
import { ProfessionalId } from '../../domain/value-objects';
import { ProfessionalMapper } from '../mappers';

export class PrismaProfessionalRepository implements ProfessionalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(professional: Professional): Promise<void> {
    const data = ProfessionalMapper.toPersistence(professional);
    const where =
      data.id && data.id.trim()
        ? { id: data.id }
        : data.email
          ? { email: data.email }
          : null;

    if (!where) {
      throw new InvalidProfessionalIdError();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.prisma.professional.upsert({
      where,
      update: {
        userId: data.userId,
        email: data.email,
        status: data.status,
        fullName: data.fullName,
        licenseNumber: data.licenseNumber,
        specialties: data.specialties,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        userId: data.userId,
        email: data.email,
        status: data.status,
        fullName: data.fullName,
        licenseNumber: data.licenseNumber,
        specialties: data.specialties,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: ProfessionalId): Promise<Professional | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const record = await this.prisma.professional.findUnique({
      where: {
        id: id.value,
      },
    });

    if (!record) {
      return null;
    }

    return ProfessionalMapper.toDomain(record);
  }

  async findByUserId(userId: string): Promise<Professional | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const record = await this.prisma.professional.findFirst({
      where: {
        userId,
      },
    });

    if (!record) {
      return null;
    }

    return ProfessionalMapper.toDomain(record);
  }

  async findByEmail(email: string): Promise<Professional | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const record = await this.prisma.professional.findUnique({
      where: {
        email,
      },
    });

    if (!record) {
      return null;
    }

    return ProfessionalMapper.toDomain(record);
  }
}
