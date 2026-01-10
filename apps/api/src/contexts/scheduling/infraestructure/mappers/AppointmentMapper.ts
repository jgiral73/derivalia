import { Prisma, AppointmentStatus as PrismaAppointmentStatus, AppointmentType as PrismaAppointmentType } from '@prisma/client';
import { Appointment } from '../../domain/aggregates';
import { AppointmentStatus, AppointmentType, TimeSlot } from '../../domain/value-objects';

export type PrismaAppointment = Prisma.AppointmentGetPayload<object>;

export class AppointmentMapper {
  static toDomain(record: PrismaAppointment): Appointment {
    return Appointment.rehydrate({
      id: record.id,
      professionalId: record.professionalId,
      patientId: record.patientId ?? null,
      organizationId: record.organizationId ?? null,
      treatmentId: record.treatmentId ?? null,
      timeSlot: TimeSlot.create(record.startAt, record.endAt),
      type: AppointmentType.fromValue(record.type),
      status: AppointmentStatus.fromValue(record.status),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(appointment: Appointment): {
    id: string;
    professionalId: string;
    patientId: string | null;
    organizationId: string | null;
    treatmentId: string | null;
    startAt: Date;
    endAt: Date;
    status: PrismaAppointmentStatus;
    type: PrismaAppointmentType;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: appointment.id,
      professionalId: appointment.professionalId,
      patientId: appointment.patientId,
      organizationId: appointment.organizationId,
      treatmentId: appointment.treatmentId,
      startAt: appointment.timeSlot.startAt,
      endAt: appointment.timeSlot.endAt,
      status: appointment.getStatus().value as PrismaAppointmentStatus,
      type: appointment.type.value as PrismaAppointmentType,
      createdAt: appointment.createdAt,
      updatedAt: appointment.getUpdatedAt(),
    };
  }
}
