export class RequestCollaborationRequestDto {
  requesterProfessionalId!: string;
  patientId!: string;
  purposeSpecialty!: string;
  purposeDescription?: string;
  scopeCanViewClinicalRecords!: boolean;
  scopeCanAddNotes!: boolean;
  scopeCanSuggestTreatment!: boolean;
  scopeCanAccessForms!: boolean;
  periodFrom!: string;
  periodTo?: string;
  collaboratorProfessionalId?: string;
  collaboratorEmail?: string;
  treatmentId?: string;
}
