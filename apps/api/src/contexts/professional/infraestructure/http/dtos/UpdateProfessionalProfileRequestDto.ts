export class UpdateProfessionalProfileRequestDto {
  professionalId!: string;
  fullName?: string;
  licenseNumber?: string;
  specialties?: string[];
}
