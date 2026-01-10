export class CreatePatientRequestDto {
  professionalId!: string;
  fullName!: string;
  birthDate?: string;
  email?: string;
  phone?: string;
}
