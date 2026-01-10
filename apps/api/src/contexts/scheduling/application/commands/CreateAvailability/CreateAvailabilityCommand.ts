export class CreateAvailabilityCommand {
  constructor(
    public readonly professionalId: string,
    public readonly startAt: Date,
    public readonly endAt: Date,
    public readonly slotType?: string,
  ) {}
}
