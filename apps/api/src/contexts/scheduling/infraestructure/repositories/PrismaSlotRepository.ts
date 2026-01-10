import { PrismaService } from 'src/shared';
import { SchedulingSlot } from '../../domain/entities';
import { SlotRepository } from '../../domain/repositories';
import { TimeSlot } from '../../domain/value-objects';
import { SlotMapper } from '../mappers';

export class PrismaSlotRepository implements SlotRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(slot: SchedulingSlot): Promise<void> {
    const data = SlotMapper.toPersistence(slot);

    await this.prisma.schedulingSlot.upsert({
      where: {
        id: data.id,
      },
      update: {
        type: data.type,
        startAt: data.startAt,
        endAt: data.endAt,
      },
      create: {
        id: data.id,
        professionalId: data.professionalId,
        type: data.type,
        startAt: data.startAt,
        endAt: data.endAt,
        createdAt: data.createdAt,
      },
    });
  }

  async findOverlapping(
    professionalId: string,
    slot: TimeSlot,
  ): Promise<SchedulingSlot[]> {
    const records = await this.prisma.schedulingSlot.findMany({
      where: {
        professionalId,
        startAt: { lt: slot.endAt },
        endAt: { gt: slot.startAt },
      },
    });

    return records.map((record) => SlotMapper.toDomain(record));
  }
}
