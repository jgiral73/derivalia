import { randomUUID } from 'crypto';
import { SchedulingSlot } from '../../../domain/entities';
import { SlotRepository } from '../../../domain/repositories';
import { AvailabilityPolicy } from '../../../domain/services';
import { SlotType, TimeSlot } from '../../../domain/value-objects';
import { CreateAvailabilityCommand } from './CreateAvailabilityCommand';

export class CreateAvailabilityHandler {
  constructor(
    private readonly slots: SlotRepository,
    private readonly availability: AvailabilityPolicy,
  ) {}

  async execute(command: CreateAvailabilityCommand): Promise<string> {
    const timeSlot = TimeSlot.create(command.startAt, command.endAt);
    await this.availability.assertAvailable(command.professionalId, timeSlot);

    const slot = new SchedulingSlot(
      randomUUID(),
      command.professionalId,
      SlotType.fromValue(command.slotType ?? 'availability'),
      timeSlot,
      new Date(),
    );

    await this.slots.save(slot);

    return slot.id;
  }
}
