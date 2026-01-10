/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Prisma,
  ProfessionalStatus as PrismaProfessionalStatus,
} from '@prisma/client';
import { Professional } from '../../domain/aggregates';
import {
  FullName,
  LicenseNumber,
  ProfessionalId,
  ProfessionalStatus,
  Specialty,
} from '../../domain/value-objects';

export type PrismaProfessional = Prisma.ProfessionalGetPayload<object>;

export class ProfessionalMapper {
  static toDomain(record: PrismaProfessional): Professional {
    const fullName = record.fullName ? FullName.create(record.fullName) : null;
    const licenseNumber = record.licenseNumber
      ? LicenseNumber.create(record.licenseNumber)
      : null;
    const specialtyValues = Array.isArray(record.specialties)
      ? record.specialties
      : [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const specialties = specialtyValues
      .filter((value): value is string => typeof value === 'string')
      .map((specialty) => Specialty.create(specialty));

    return Professional.rehydrate({
      id: ProfessionalId.fromString(record.id),
      userId: record.userId ?? null,
      email: record.email ?? null,
      status: ProfessionalStatus.fromValue(record.status),
      fullName,
      licenseNumber,
      specialties,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(professional: Professional): {
    id: string;
    userId: string | null;
    email: string | null;
    status: PrismaProfessionalStatus;
    fullName: string | null;
    licenseNumber: string | null;
    specialties: string[];
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: professional.id.value,
      userId: professional.userId,
      email: professional.email,
      status: professional.getStatus().value as PrismaProfessionalStatus,
      fullName: professional.getFullName()?.value ?? null,
      licenseNumber: professional.getLicenseNumber()?.value ?? null,
      specialties: professional.getSpecialties().map((item) => item.value),
      createdAt: professional.createdAt,
      updatedAt: professional.getUpdatedAt(),
    };
  }
}
