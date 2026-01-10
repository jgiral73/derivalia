export class StartTreatmentRequestDto {
  patientId!: string;
  professionalId!: string;
  organizationId?: string | null;
  goal?: string;
}
