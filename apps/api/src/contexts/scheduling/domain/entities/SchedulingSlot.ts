import { SlotType, TimeSlot } from '../value-objects';

export class SchedulingSlot {
  constructor(
    public readonly id: string,
    public readonly professionalId: string,
    public readonly type: SlotType,
    public readonly timeSlot: TimeSlot,
    public readonly createdAt: Date,
  ) {}
}
