import { Appointment } from '../aggregates';
import { TimeSlot } from '../value-objects';

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  findById(id: string): Promise<Appointment | null>;
  findOverlapping(
    professionalId: string,
    slot: TimeSlot,
  ): Promise<Appointment[]>;
}
