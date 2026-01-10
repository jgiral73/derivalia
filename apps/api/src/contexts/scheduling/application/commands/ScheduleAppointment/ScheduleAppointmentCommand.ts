export class ScheduleAppointmentCommand {
  constructor(
    public readonly professionalId: string,
    public readonly patientId: string | null,
    public readonly organizationId: string | null,
    public readonly treatmentId: string | null,
    public readonly startAt: Date,
    public readonly endAt: Date,
    public readonly type?: string,
  ) {}
}
