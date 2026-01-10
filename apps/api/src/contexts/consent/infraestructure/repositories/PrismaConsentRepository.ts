import { PrismaService } from 'src/shared';
import { ConsentRepository } from '../../domain/repositories';
import { Consent } from '../../domain/aggregates';
import { ConsentId } from '../../domain/value-objects';
import { ConsentMapper } from '../mappers';

export class PrismaConsentRepository implements ConsentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(consent: Consent): Promise<void> {
    const data = ConsentMapper.toPersistence(consent);

    await this.prisma.consent.upsert({
      where: {
        id: data.consent.id,
      },
      update: {
        patientId: data.consent.patientId,
        granteeId: data.consent.granteeId,
        scopeType: data.consent.scopeType,
        scopeRef: data.consent.scopeRef,
        purpose: data.consent.purpose,
        decision: data.consent.decision,
        validFrom: data.consent.validFrom,
        validUntil: data.consent.validUntil,
        updatedAt: data.consent.updatedAt,
      },
      create: {
        id: data.consent.id,
        patientId: data.consent.patientId,
        granteeId: data.consent.granteeId,
        scopeType: data.consent.scopeType,
        scopeRef: data.consent.scopeRef,
        purpose: data.consent.purpose,
        decision: data.consent.decision,
        validFrom: data.consent.validFrom,
        validUntil: data.consent.validUntil,
        createdAt: data.consent.createdAt,
        updatedAt: data.consent.updatedAt,
      },
    });

    await this.prisma.consentConformity.deleteMany({
      where: {
        consentId: data.consent.id,
      },
    });

    if (data.conformities.length > 0) {
      await this.prisma.consentConformity.createMany({
        data: data.conformities,
      });
    }
  }

  async findById(id: ConsentId): Promise<Consent | null> {
    const record = await this.prisma.consent.findUnique({
      where: {
        id: id.value,
      },
      include: {
        conformities: true,
      },
    });

    if (!record) {
      return null;
    }

    return ConsentMapper.toDomain(record);
  }

  async findActiveForPatient(
    patientId: string,
    granteeId: string,
  ): Promise<Consent[]> {
    const now = new Date();
    const records = await this.prisma.consent.findMany({
      where: {
        patientId,
        granteeId,
        validFrom: { lte: now },
        OR: [{ validUntil: null }, { validUntil: { gte: now } }],
      },
      include: {
        conformities: true,
      },
    });

    return records.map((record) => ConsentMapper.toDomain(record));
  }
}
