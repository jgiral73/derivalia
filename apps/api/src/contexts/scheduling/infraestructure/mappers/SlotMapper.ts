import { Prisma, SlotType as PrismaSlotType } from '@prisma/client';
import { SchedulingSlot } from '../../domain/entities';
import { SlotType, TimeSlot } from '../../domain/value-objects';

export type PrismaSchedulingSlot = Prisma.SchedulingSlotGetPayload<object>;

export class SlotMapper {
  static toDomain(record: PrismaSchedulingSlot): SchedulingSlot {
    return new SchedulingSlot(
      record.id,
      record.professionalId,
      SlotType.fromValue(record.type),
      TimeSlot.create(record.startAt, record.endAt),
      record.createdAt,
    );
  }

  static toPersistence(slot: SchedulingSlot): {
    id: string;
    professionalId: string;
    type: PrismaSlotType;
    startAt: Date;
    endAt: Date;
    createdAt: Date;
  } {
    return {
      id: slot.id,
      professionalId: slot.professionalId,
      type: slot.type.value as PrismaSlotType,
      startAt: slot.timeSlot.startAt,
      endAt: slot.timeSlot.endAt,
      createdAt: slot.createdAt,
    };
  }
}
