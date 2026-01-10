import { Patient as PrismaPatient } from '@prisma/client';
import { Patient } from '../../domain/aggregates';
import {
  BirthDate,
  ContactInfo,
  PatientId,
  PatientName,
  PatientStatus,
  PatientStatusValue,
} from '../../domain/value-objects';

export class PatientMapper {
  static toDomain(record: PrismaPatient): Patient {
    const birthDate = record.birthDate
      ? BirthDate.fromDate(record.birthDate)
      : null;
    const contactInfo =
      record.email || record.phone
        ? ContactInfo.create({
            email: record.email ?? undefined,
            phone: record.phone ?? undefined,
          })
        : null;

    return Patient.rehydrate({
      id: PatientId.fromString(record.id),
      name: PatientName.create(record.fullName),
      createdByProfessionalId: record.createdByProfessionalId,
      status: PatientStatus.fromValue(record.status as PatientStatusValue),
      userId: record.userId ?? null,
      birthDate,
      contactInfo,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(patient: Patient): {
    id: string;
    fullName: string;
    createdByProfessionalId: string;
    userId: string | null;
    status: string;
    email: string | null;
    phone: string | null;
    birthDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    const contact = patient.getContactInfo();
    const birthDate = patient.getBirthDate();

    return {
      id: patient.id.value,
      fullName: patient.name.value,
      createdByProfessionalId: patient.createdByProfessionalId,
      userId: patient.getUserId(),
      status: patient.getStatus().value,
      email: contact?.email ?? null,
      phone: contact?.phone ?? null,
      birthDate: birthDate?.value ?? null,
      createdAt: patient.createdAt,
      updatedAt: patient.getUpdatedAt(),
    };
  }
}
