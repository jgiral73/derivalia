export class RequestCollaborationCommand {
  constructor(
    public readonly requesterProfessionalId: string,
    public readonly patientId: string,
    public readonly purposeSpecialty: string,
    public readonly purposeDescription: string | undefined,
    public readonly scopeCanViewClinicalRecords: boolean,
    public readonly scopeCanAddNotes: boolean,
    public readonly scopeCanSuggestTreatment: boolean,
    public readonly scopeCanAccessForms: boolean,
    public readonly periodFrom: Date,
    public readonly periodTo: Date | undefined,
    public readonly collaboratorProfessionalId?: string,
    public readonly collaboratorEmail?: string,
    public readonly treatmentId?: string,
  ) {}
}
