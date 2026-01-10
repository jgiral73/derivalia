import { PrismaService } from 'src/shared';
import { Appointment } from '../../domain/aggregates';
import { AppointmentRepository } from '../../domain/repositories';
import { TimeSlot } from '../../domain/value-objects';
import { AppointmentMapper } from '../mappers';

export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(appointment: Appointment): Promise<void> {
    const data = AppointmentMapper.toPersistence(appointment);

    await this.prisma.appointment.upsert({
      where: {
        id: data.id,
      },
      update: {
        patientId: data.patientId,
        organizationId: data.organizationId,
        treatmentId: data.treatmentId,
        startAt: data.startAt,
        endAt: data.endAt,
        status: data.status,
        type: data.type,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        professionalId: data.professionalId,
        patientId: data.patientId,
        organizationId: data.organizationId,
        treatmentId: data.treatmentId,
        startAt: data.startAt,
        endAt: data.endAt,
        status: data.status,
        type: data.type,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Appointment | null> {
    const record = await this.prisma.appointment.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return null;
    }

    return AppointmentMapper.toDomain(record);
  }

  async findOverlapping(
    professionalId: string,
    slot: TimeSlot,
  ): Promise<Appointment[]> {
    const records = await this.prisma.appointment.findMany({
      where: {
        professionalId,
        status: 'scheduled',
        startAt: { lt: slot.endAt },
        endAt: { gt: slot.startAt },
      },
    });

    return records.map((record) => AppointmentMapper.toDomain(record));
  }
}
