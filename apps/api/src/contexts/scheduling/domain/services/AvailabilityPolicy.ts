import { AppointmentOverlapError } from '../errors';
import { AppointmentRepository, SlotRepository } from '../repositories';
import { TimeSlot } from '../value-objects';

export class AvailabilityPolicy {
  constructor(
    private readonly appointments: AppointmentRepository,
    private readonly slots: SlotRepository,
  ) {}

  async assertAvailable(professionalId: string, slot: TimeSlot): Promise<void> {
    const overlappingAppointments = await this.appointments.findOverlapping(
      professionalId,
      slot,
    );
    if (overlappingAppointments.length > 0) {
      throw new AppointmentOverlapError();
    }

    const overlappingSlots = await this.slots.findOverlapping(
      professionalId,
      slot,
    );
    if (overlappingSlots.length > 0) {
      throw new AppointmentOverlapError();
    }
  }
}
