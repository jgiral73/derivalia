import { Prisma, TreatmentStatus as PrismaTreatmentStatus } from '@prisma/client';
import { Treatment } from '../../domain/aggregates';
import {
  TreatmentGoal,
  TreatmentId,
  TreatmentPeriod,
  TreatmentStatus,
} from '../../domain/value-objects';

export type PrismaTreatment = Prisma.TreatmentGetPayload<object>;

export class TreatmentMapper {
  static toDomain(record: PrismaTreatment): Treatment {
    return Treatment.rehydrate({
      id: TreatmentId.fromString(record.id),
      patientId: record.patientId,
      professionalId: record.professionalId,
      organizationId: record.organizationId ?? null,
      goal: TreatmentGoal.create(record.goal),
      period: TreatmentPeriod.fromDates(record.startAt, record.endAt ?? null),
      status: TreatmentStatus.fromValue(record.status),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(treatment: Treatment): {
    id: string;
    patientId: string;
    professionalId: string;
    organizationId: string | null;
    goal: string;
    status: PrismaTreatmentStatus;
    startAt: Date;
    endAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    const period = treatment.getPeriod();
    return {
      id: treatment.id.value,
      patientId: treatment.patientId,
      professionalId: treatment.professionalId,
      organizationId: treatment.organizationId,
      goal: treatment.goal.value,
      status: treatment.getStatus().value as PrismaTreatmentStatus,
      startAt: period.startAt,
      endAt: period.endAt,
      createdAt: treatment.createdAt,
      updatedAt: treatment.getUpdatedAt(),
    };
  }
}
