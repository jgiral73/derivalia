export class RescheduleAppointmentCommand {
  constructor(
    public readonly appointmentId: string,
    public readonly startAt: Date,
    public readonly endAt: Date,
  ) {}
}
