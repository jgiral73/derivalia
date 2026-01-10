import { AggregateRoot } from 'src/shared';
import {
  AppointmentCancelled,
  AppointmentRescheduled,
  AppointmentScheduled,
} from '../events';
import { AppointmentStatus, AppointmentType, TimeSlot } from '../value-objects';

export class Appointment extends AggregateRoot {
  private status: AppointmentStatus;
  private updatedAt: Date;

  private constructor(
    public readonly id: string,
    public readonly professionalId: string,
    public readonly patientId: string | null,
    public readonly organizationId: string | null,
    public readonly treatmentId: string | null,
    public readonly timeSlot: TimeSlot,
    public readonly type: AppointmentType,
    status: AppointmentStatus,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public readonly createdAt: Date;

  static schedule(params: {
    id: string;
    professionalId: string;
    patientId: string | null;
    organizationId: string | null;
    treatmentId: string | null;
    timeSlot: TimeSlot;
    type: AppointmentType;
  }): Appointment {
    const now = new Date();
    const appointment = new Appointment(
      params.id,
      params.professionalId,
      params.patientId,
      params.organizationId,
      params.treatmentId,
      params.timeSlot,
      params.type,
      AppointmentStatus.Scheduled,
      now,
      now,
    );

    appointment.addDomainEvent(
      new AppointmentScheduled(appointment.id, appointment.professionalId),
    );

    return appointment;
  }

  static rehydrate(params: {
    id: string;
    professionalId: string;
    patientId: string | null;
    organizationId: string | null;
    treatmentId: string | null;
    timeSlot: TimeSlot;
    type: AppointmentType;
    status: AppointmentStatus;
    createdAt: Date;
    updatedAt: Date;
  }): Appointment {
    return new Appointment(
      params.id,
      params.professionalId,
      params.patientId,
      params.organizationId,
      params.treatmentId,
      params.timeSlot,
      params.type,
      params.status,
      params.createdAt,
      params.updatedAt,
    );
  }

  cancel(): void {
    this.status = this.status.transitionTo(AppointmentStatus.Cancelled);
    this.updatedAt = new Date();
    this.addDomainEvent(new AppointmentCancelled(this.id, this.professionalId));
  }

  reschedule(newAppointmentId: string): void {
    this.status = this.status.transitionTo(AppointmentStatus.Rescheduled);
    this.updatedAt = new Date();
    this.addDomainEvent(
      new AppointmentRescheduled(
        this.id,
        this.professionalId,
        newAppointmentId,
      ),
    );
  }

  getStatus(): AppointmentStatus {
    return this.status;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
