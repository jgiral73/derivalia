export class CollaborationScope {
  constructor(
    public readonly canViewClinicalRecords: boolean,
    public readonly canAddNotes: boolean,
    public readonly canSuggestTreatment: boolean,
    public readonly canAccessForms: boolean,
  ) {}
}
