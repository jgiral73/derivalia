export class CreateAvailabilityRequestDto {
  professionalId!: string;
  startAt!: string;
  endAt!: string;
  slotType?: string;
}
