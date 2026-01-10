export class ScheduleAppointmentRequestDto {
  professionalId!: string;
  patientId?: string | null;
  organizationId?: string | null;
  treatmentId?: string | null;
  startAt!: string;
  endAt!: string;
  type?: string;
}
