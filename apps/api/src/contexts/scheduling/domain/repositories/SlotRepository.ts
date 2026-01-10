import { SchedulingSlot } from '../entities';
import { TimeSlot } from '../value-objects';

export interface SlotRepository {
  save(slot: SchedulingSlot): Promise<void>;
  findOverlapping(
    professionalId: string,
    slot: TimeSlot,
  ): Promise<SchedulingSlot[]>;
}
